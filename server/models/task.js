"use strict";
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const taskScheme = new Schema({
    executor: ObjectId,
    assigner: ObjectId,
    description: String,
    deadline: Date
}, { versionKey: false });

const task = mongoose.model("task", taskScheme);

class Task {
    constructor(chatData) {
        this.executor = chatData.executor;
        this.assigner = chatData.assigner;
        this.description = chatData.description;
        this.deadline = chatData.deadline;
    }

    static getById(id) {
        return task.findById(id).exec();
    }

    static getAllByExecutorId(executorId) {
        return task.find({executor: executorId}).exec();
    }

    static async create(chatData) {
        const chatObj = new Task(chatData);
        return new task(chatObj).save();
    }

    static delete(id) {
        return task.deleteOne({_id: id}).exec();
    }
}

module.exports = Task;