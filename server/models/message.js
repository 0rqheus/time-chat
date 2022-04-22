"use strict";
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const messageScheme = new Schema({
    senderId: ObjectId,
    chatId: ObjectId,
    text: String,
    chosen: Number,
    sendingTime: Date
}, { versionKey: false });

const message = mongoose.model("message", messageScheme);

class Message {
    constructor(messageData) {
        this.senderId = messageData.senderId;
        this.chatId = messageData.chatId;
        this.text = messageData.text;
        this.sendingTime = Date.now();
        this.chosen = 0;
    }

    static async create(messageData) {
        const messageObj = new Message(messageData);
        return await new message(messageObj).save();
    }

    static getAllByChatId(chatId) {
        return message.find({chatId: chatId}).exec();
    }

    static getAllByIds(ids) {
        return message.find({_id: {$in: ids}}).exec();
    }

    static getLastMessageInChat(chatId) {
        return message.findOne({chatId: chatId}).sort({sendingTime: -1}).exec();
    }

    static choose(messageId) {
        return message.findByIdAndUpdate(messageId, {$inc: {chosen: 1}}).exec();
    }

    static deleteAllInEndedChat(chatId) {
        return message.deleteMany({chatId: chatId, counter: 0}).exec();
    }
}

module.exports = Message;