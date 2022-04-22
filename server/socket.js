"use strict";
const Poll = require("./models/poll");
const Message = require("./models/message");
const ClientMessage = require("./models/clientMessage");

module.exports = function (io, socket) {
    socket.on("join chat", (chatId) => {
        socket.join(chatId);
    });

    socket.on("leave chat", (chatId) => {
        socket.leave(chatId);
    });

    socket.on("new message", (data) => {
        Message.create(data)
            .then(message => ClientMessage.fromMessage(message))
            .then(clientMessage => io.to(data.chatId).emit("new message", clientMessage))
            .catch(console.error);
    });

    socket.on("new poll", (data) => {
        Poll.create(data)
            .then(poll => io.to(data.chatId).emit("new poll", poll))
            .catch(console.error);
    });

    socket.on("poll vote", async (data) => {

        const { userId, pollId, choices } = data;
        // choices is [{questionId, answerId, answersType, variant}];

        const chosenAnswers = choices.filter(item => item.answersType !== "textInput");
        const inputAnswers = choices.filter(item => item.answersType === "textInput");

        const existingVariants = chosenAnswers.length > 0 ? chosenAnswers.map(item => item.answerId) : [];
        console.log(choices);
        console.log(existingVariants);

        const getAnswerId = (pollItems, questionId, variant) => {

            const pollItem = pollItems.find(item => String(item._id) === String(questionId));
            const answer = pollItem.answers.find(item => item.variant === variant);

            return answer ? answer._id : null;
        };

        try {

            const poll = await Poll.getById(pollId);

            for(const item of inputAnswers) {
                const answerId = getAnswerId(poll.data, item.questionId, item.variant);

                if(answerId)
                    existingVariants.push(answerId);
                else
                    await Poll.createAnswerVariant(pollId, item.questionId, item.variant);
            }

            await Poll.updateAnswerVotes(pollId, existingVariants);

            const updatedPoll = await Poll.updateVotedUsers(pollId, userId);
            
            
            io.to(updatedPoll.chatId).emit("update poll results", updatedPoll);

        } catch (err) {
            console.error(err);
        }
    });
};