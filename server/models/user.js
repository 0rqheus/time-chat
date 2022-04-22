"use strict";
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");
const defaulUserImg = "https://res.cloudinary.com/dlnpmqydd/image/upload/v1569785232/samples/animals/cat.jpg";

const userScheme = new Schema({
    login: String,
    passwordHash: String,
    username: String,
    photoUrl: String,
    role: String,
    registeredAt: Date
}, { versionKey: false });

const user = mongoose.model("user", userScheme);

class User {
    constructor(userData) {
        this.login = userData.login;
        this.passwordHash = userData.passwordHash;
        this.role = "user";
        this.username = userData.username || userData.login;
        this.photoUrl = userData.photoUrl || defaulUserImg;
        this.registeredAt = new Date();
    };

    static async create(userParams) {
        const params = userParams;
        params.passwordHash = await User.hashPassword(userParams.password);
        const newUser = new User(params);
        
        return new user(newUser).save();
    }

    static getById(id) {
        return user.findById(id).exec();
    };

    static getByLogin(login) {
        return user.findOne({ login: login }).exec();
    }

    static getAllByIds(ids) {
        return user.find({_id: {$in: ids}}).exec();
    }

    static update(id, userParams) {
        return user.findByIdAndUpdate(id, userParams, { new: true }).exec();
    }

    static deleteById(id) {
        return user.deleteOne({ _id: id }).exec();
    }

    static async validatePassword(login, password) {
        const currUser = await user.findOne({ login }).exec();
        return bcrypt.compare(password, currUser.passwordHash);
    }

    static async hashPassword(password) {
        return bcrypt.hash(password, 10);
    }

}

module.exports = User;