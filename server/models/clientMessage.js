"use strict";
const User = require("./user");

class ClientMessage {
    constructor(msg, user) {
        this._id = msg._id;
        this.sender = {
            _id: user._id,
            username: user.username,
            photoUrl: user.photoUrl
        };
        this.chatId = msg.chatId;
        this.text = msg.text;
        this.sendingTime = msg.sendingTime;
        this.chosen = msg.chosen;
    }

    static async fromMessage(message) {
        const user = await User.getById(message.senderId);
        return new ClientMessage(message, user);
    }

    static async fromMessages(messages) {
        const clientMessages = [];

        const senderIds = new Set(messages.map(msg => msg.senderId));

        try{
            
            const senders = await User.getAllByIds(Array.from(senderIds));
    
            for(const msg of messages) {
                const sender = senders.find(sender => String(sender._id) === String(msg.senderId));
                const message = new ClientMessage(msg, sender);    
                clientMessages.push(message);
            }

        } catch(err) {
            console.error(err);
        }
        

        return clientMessages;
    }
}

module.exports = ClientMessage;