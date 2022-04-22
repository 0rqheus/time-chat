import React from "react";

import ChatArea from "./ChatArea/ChatArea";
import PollsArea from "./PollsArea/PollsArea";

import "./chat.scss";

const Chat = (props) => {

    const chatId = props.match.params.id;

    return (
        <div className="chat-page">
            <ChatArea chatId={chatId}/>
            <PollsArea chatId={chatId}/>
        </div>
    );
};

export default Chat;