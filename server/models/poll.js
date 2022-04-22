"use strict";
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const pollScheme = new Schema({
    creatorId: ObjectId,
    chatId: ObjectId,
    data: [
        {
            question: String,
            answersType: String,
            answers: [
                {
                    variant: String,
                    votes: Number
                }
            ]
        }
    ],
    sendingTime: Date,
    votedUsers: [ObjectId]
}, { versionKey: false });

const poll = mongoose.model("poll", pollScheme);

class Poll {
    constructor(pollData) {
        this.creatorId = pollData.creatorId;
        this.chatId = pollData.chatId;
        this.data = pollData.data;
        this.sendingTime = Date.now();
    }

    static getById(id) {
        return poll.findById(id).exec();
    }

    static getAllByChatId(chatId) {
        return poll.find({ chatId: chatId }).exec();
    }

    static getAllByIds(idsArr) {
        return poll.find({ _id: { $in: idsArr } }).exec();
    }


    static create(pollData) {
        const pollObj = new Poll(pollData);
        return new poll(pollObj).save();
    }

    static existVariant(pollId, questionId, variant) {
        return poll.exists({
            _id: pollId, 
            data: { 
                $elemMatch: { 
                    _id: questionId,
                    answers: { $elemMatch: { variant: variant } } 
                } 
            } 
        });
    }

    static updateAnswerVotes(pollId, answerIds) {

        return poll.findByIdAndUpdate(pollId, {
            $inc: { "data.$[].answers.$[answer].votes": 1 }
        }, {
            arrayFilters: [
                { "answer._id": {$in: answerIds} }
            ],
            new: true
        }).exec();
    }

    static createAnswerVariant(pollId, questionId, variant) {

        return poll.findByIdAndUpdate(pollId, {
            $push: {"data.$[question].answers": {variant: variant, votes: 1}}
        }, {
            arrayFilters: [
                { "question._id": questionId }, 
            ],
            new: true
        }).exec();
    }

    static updateVotedUsers(id, userId) {

        return poll.findByIdAndUpdate(id, { $push: { "votedUsers": userId } }).exec();
    }

    static deleteAllInEndedChat(chatId) {
        return poll.deleteMany({ chatId: chatId }).exec();
    }
}

module.exports = Poll;