"use strict";
const Poll = require("../models/poll");
const Message = require("../models/message");
const Chat = require("../models/chat");
const User = require("../models/user");
const ClientMessage = require("../models/clientMessage");
const passportJWT = require("passport-jwt");
const router = require("express").Router();
const crypto = require("crypto");

const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;


module.exports = function (passport) {

    const getInviteCode = (chat) => crypto.createHmac("sha256", "53CR37").update(String(chat._id) + chat.creationDate.toISOString()).digest("hex");

    passport.use(new JWTStrategy({
        jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
        secretOrKey: process.env.JWT_SECRET
    }, (jwtPayload, cb) => {
        User.getById(jwtPayload.id)
            .then(user => {
                return cb(null, user);
            })
            .catch(err => {
                return cb(err);
            });
    }));

    router.use(passport.authenticate("jwt", { session: false }));

    router.use("/", (req, res, next) => {
        req.user
            ? next()
            : res.sendStatus(401);
    });

    router.post("/create", (req, res) => {
        if (!req.body) return res.sendStatus(400);

        const { name, creatorId, endDateTime } = req.body;

        Chat.create({ name, creatorId, endDateTime })
            .then(chat => res.json(chat))
            .catch(err => res.status(500).json(err));
    });

    router.get("/my", async (req, res) => {
        const userId = req.user.id;

        try {
            const chats = await Chat.getAllByUserId(userId);
    
            const chatList = [];
                    
            for(const chat of chats) {
                const lastMsg = await Message.getLastMessageInChat(chat._id);

                let lastMessage = null;

                if(lastMsg)
                {
                    lastMessage = await ClientMessage.fromMessage(lastMsg);
                }
                 
                chatList.push({
                    _id: chat._id,
                    name: chat.name,
                    members: chat.members,
                    endDateTime: chat.endDateTime,
                    lastMessage: lastMessage
                });
            }
    
            res.json(chatList);
        } catch(err) {
            res.status(500).json(err);
        }
    });

    router.get("/:chatId/messages_history", (req, res) => {
        const chatId = req.params.chatId;

        Message.getAllByChatId(chatId)
            .then(messages => ClientMessage.fromMessages(messages))
            .then(clientMessages => res.json(clientMessages))
            .catch(err => res.status(500).json(err));

    });

    router.get("/:chatId/polls_history", (req, res) => {
        const chatId = req.params.chatId;

        Poll.getAllByChatId(chatId)
            .then(polls => res.json(polls))
            .catch(err => res.status(500).json(err));

    });

    router.get("/:chatId/get_invite_link", (req, res) => {
        const chatId = req.params.chatId;
        // const userId = req.user._id;

        Chat.getById(chatId)
            .then(chat => res.json(`localhost:3000/chats/${chatId}/join/${getInviteCode(chat)}`))
            .catch(err => res.status(500).json(err));
    });

    router.get("/:chatId/join", (req, res) => {
        const chatId = req.params.chatId;
        const userId = req.user._id;
        const code = req.query.code;

        console.log(`code: ${code}`);

        Chat.getById(chatId)
            .then(chat => {
                if (code === getInviteCode(chat)) {
                    if (!chat.members.includes(userId)) {
                        Chat.addMember(chatId, userId);
                    }
                    res.sendStatus(200);
                } else {
                    return res.sendStatus(403);
                }
            })
            .catch(console.error);

    });

    router.get("/:chatId/leave", (req, res) => {
        const chatId = req.params.chatId;
        const userId = req.user._id;

        Chat.removeMember(chatId, userId)
            .then(() => res.sendStatus(200))
            .catch(err => res.status(500).json(err));

    });

    router.get("/:chatId", (req, res) => {
        const chatId = req.params.chatId;

        Chat.getById(chatId)
            .then(chat => res.json(chat))
            .catch(err => res.status(500).json(err));

    });


    return router;
};