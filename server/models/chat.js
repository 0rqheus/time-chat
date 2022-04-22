"use strict";
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const chatScheme = new Schema({
    creatorId: ObjectId,
    name: String,
    members: [ObjectId],
    creationDate: Date,
    endDateTime: Date
}, { versionKey: false });

const chat = mongoose.model("chat", chatScheme);

class Chat {
    constructor(chatData) {
        this.creatorId = chatData.creatorId;
        this.members = [chatData.creatorId];
        this.name = chatData.name;
        this.creationDate = Date.now();
        this.endDateTime = chatData.endDateTime;
    }

    static getById(id) {
        return chat.findById(id).exec();
    }

    static getAllByUserId(userId) {
        return chat.find({members: userId}).exec();
    }

    static async create(chatData) {
        const chatObj = new Chat(chatData);
        return new chat(chatObj).save();
    }

    static delete(chatId) {
        return chat.deleteOne({_id: chatId}).exec();
    }

    static getAllEnded() {
        return chat.find({endDateTime: {"$lte": new Date()}}).exec();
    }

    static async addMember(chatId, memberId) {
        return chat.findByIdAndUpdate(chatId, {$push: { members: memberId }}, { new: true }).exec();
    }

    static async removeMember(chatId, memberId) {
        return chat.findByIdAndUpdate(chatId, { $pull: { members: memberId } }, { new: true }).exec();
    }
}

module.exports = Chat;