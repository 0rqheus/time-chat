"use strict";
const express = require("express");
const bodyParser = require("body-parser");
require("dotenv").config();
const mongoose = require("mongoose");
const cors = require("cors");
const session = require("express-session");
const passport = require("passport");
const socketHandle = require("./socket");

const Poll = require("./models/poll");
const Message = require("./models/message");
const Chat = require("./models/chat");
const User = require("./models/user");

const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({ secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => done(null, user.id));

passport.deserializeUser((id, done) => {
    User.getById(id)
        .then(user => done(null, user))
        .catch(err => done(err));
});



mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useFindAndModify: false, useUnifiedTopology: true })
    .then(() => {

        console.log("Mongo database connected");

        const port = process.env.PORT || 8000;
        http.listen(port, () => console.log(`Server started on port ${port}`));
    })
    .catch(() => console.error("ERROR: Mongo database not connected:\n", process.env.MONGODB_URI));


app.use(cors());



const apiAuthRoute = require("./api/auth")(passport);
app.use("/api/auth", apiAuthRoute);

const apiChatsRoute = require("./api/chats")(passport);
app.use("/api/chats", apiChatsRoute);

const apiTasksRoute = require("./api/tasks")(passport);
app.use("/api/tasks", apiTasksRoute);

const apiStorages = require("./api/storage")(passport);
app.use("/api/storage", apiStorages);


io.on("connection", (socket) => socketHandle(io, socket));


setInterval(() => {
    Chat.getAllEnded()
        .then(chats => {

            if (chats.length > 0) {
                console.log("deleting chats...");

                chats.forEach(item => {
                    const chatId = item._id;

                    Poll.deleteAllInEndedChat(chatId);
                    Message.deleteAllInEndedChat(chatId);
                    Chat.delete(chatId);

                    // @todo emit to disconnect clients
                });
            }
        })
        .catch(console.error);
}, 60000);