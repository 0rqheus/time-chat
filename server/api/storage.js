"use strict";
const Storage = require("../models/storage");
const Message = require("../models/message");
const Poll = require("../models/poll");
const User = require("../models/user");
const Chat = require("../models/chat");
const ClientMessage = require("../models/clientMessage");
const passportJWT = require("passport-jwt");
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

const router = require("express").Router();


module.exports = function (passport) {


    const checkExisting = async (userId, chatId) => {
        const storage = await Storage.getByUser(userId);
        const targetChat = storage.chats.find(chat => chat.id === chatId);

        if(!targetChat)
        {
            const chat = Chat.getById(chatId);
            await Storage.addChat(userId, chatId, chat.name);
        }
    };

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

    router.get("/:userId/chat/:chatId", (req, res) => {
        const userId = req.params.userId;
        const chatId = req.params.chatId;
    
        Storage.getByUser(userId)
            .then(storage =>
                res.json(storage.chats.find(chat => String(chat.id) === chatId))
            )
            .catch(err => res.status(500).json(err));
            
    });
    
    router.get("/:id", (req, res) => {
        const id = req.params.id;
    
        Storage.getByUser(id)
            .then(storage => res.json(storage))
            .catch(err => res.status(500).json(err));
            
    });
    
    router.post("/add_messages", async (req, res) => {
        const ids = req.body.ids;
        const chatId = req.body.chatId;
        const userId = req.user._id;

        await checkExisting(userId, chatId);
    
        Storage.addMessages(userId, ids, chatId)
            .then(() => res.sendStatus(200))
            .catch(err => res.status(500).json(err));        
    });
    
    router.post("/add_polls", async (req, res) => {
        const ids = req.body.ids;
        const chatId = req.body.chatId;
        const userId = req.user._id;

        await checkExisting(userId, chatId);
    
        Storage.addPoll(userId, ids, chatId)
            .then(() => res.sendStatus(200))
            .catch(err => res.status(500).json(err));        
    });
    
    router.post("/get_messages", (req, res) => {
        const ids = req.body.ids;
    
        Message.getAllByIds(ids)
            .then(messages => ClientMessage.fromMessages(messages))
            .then(clientMessages => res.json(clientMessages))
            .catch(err => res.status(500).json(err));
            
    });
    
    router.post("/get_polls", (req, res) => {
        const ids = req.body.ids;
        
        Poll.getAllByIds(ids)
            .then(polls => res.json(polls))
            .catch(err => res.status(500).json(err));
            
    });
    
    router.post("/delete_messages", (req, res) => {
        const ids = req.body.ids;
        const chatId = req.body.chatId;
        const userId = req.user._id;
    
        Storage.deleteMessages(userId, ids, chatId)
            .then(() => res.sendStatus(200))
            .catch(err => res.status(500).json(err));        
    });
    
    router.post("/delete_polls", (req, res) => {
        const ids = req.body.ids;
        const chatId = req.body.chatId;
        const userId = req.user._id;
    
        Storage.deletePolls(userId, ids, chatId)
            .then(() => res.sendStatus(200))
            .catch(err => res.status(500).json(err));        
    });
    
    
    return router;
};

