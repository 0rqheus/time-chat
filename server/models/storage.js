"use strict";
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const storageScheme = new Schema({
    userId: ObjectId,
    chats: [
        {
            id: ObjectId,
            name: String,
            selectedMessages: [ObjectId],
            selectedPolls: [ObjectId]
        }
    ]
}, { versionKey: false });

const storage = mongoose.model("storage", storageScheme);

class Storage {
    constructor(storageData) {
        this.userId = storageData.userId;
        this.chats = [];
    }

    static getByUser(userId) {
        return storage.findOne({userId: userId}).exec();
    }

    static async create(storageData) {
        const storageObj = new Storage(storageData);
        const newStorage = await new storage(storageObj).save();

        return newStorage._id;
    }

    static async addChat(userId, chatId, chatName) {
        return storage.findOneAndUpdate({
            userId: userId
        },
        {
            $push: {
                chats: {
                    id: chatId,
                    name: chatName,
                    selectedMessages: [],
                    selectedPolls: []
                }
            }
        }).exec();
    }

    static addMessages(userId, messageIds, chatId) {
        return storage.findOneAndUpdate({
            userId: userId
        },
        {
            $push: {"chats.$[chat].selectedMessages": {$each: messageIds}}
        },
        {
            arrayFilters: [
                { "chat.id": chatId}
            ],
            new: true
        }).exec();
    }

    static addPolls(userId, pollIds, chatId) {
        return storage.findOneAndUpdate({
            userId: userId
        },
        {
            $push: {"chats.$[chat].selectedPolls": {$each: pollIds}}
        },
        {
            arrayFilters: [
                { "chat.id": chatId}
            ],
            new: true
        }).exec();
    }

    static deleteMessages(userId, messageIds, chatId) {
        return storage.findOneAndUpdate({
            userId: userId
        },
        {
            $pull: {"chats.$[chat].selectedMessages": {$in: messageIds}}
        },
        {
            arrayFilters: [
                { "chat.id": chatId}
            ],
            new: true
        }).exec();
    }

    static deletePolls(userId, pollIds, chatId) {
        return storage.findOneAndUpdate({
            userId: userId
        },
        {
            $pull: {"chats.$[chat].selectedPolls": {$in: pollIds}}
        },
        {
            arrayFilters: [
                { "chat.id": chatId}
            ],
            new: true
        }).exec();
    }

}

module.exports = Storage;