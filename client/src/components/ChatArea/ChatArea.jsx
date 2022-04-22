import React from "react";
import { useSelector } from "react-redux";
import socket from "../../socket";

import SettingsBar from "./SettingsBar";
import MessagesList from "./MessagesList";
import MessageForm from "./MessageForm";

import "./chatArea.scss";

const ChatArea = (props) => {
    
    const { chatId } = props;
    const [ chat, setChat ] = React.useState({members:[]});
    const [ chatMessages, setChatMessages ] = React.useState([]);
    const jwt = useSelector(state => state.token);

    const updateMessages = (messages) => {
        const data = Array.isArray(messages) 
            ? [...chatMessages, ...messages]
            : [...chatMessages, messages];

        console.log(chatMessages);

        setChatMessages(data);
    };
    
    socket.on("new message", (messages) => updateMessages(messages));
    
    React.useEffect(() => {
        socket.emit("join chat", chatId);

        fetch(`http://localhost:8000/api/chats/${chatId}`, {
            headers: { Authorization: `Bearer ${jwt}` }
        })
            .then(response => response.json())
            .then(chat => setChat(chat))
            .catch(console.error);

        fetch(`http://localhost:8000/api/chats/${chatId}/messages_history`, {
            headers: { Authorization: `Bearer ${jwt}` }
        })
            .then(response => response.json())
            .then(response => updateMessages(response))
            .catch(console.error);

        return () => socket.emit("leave chat", chatId);
        // eslint-disable-next-line
    }, [chatId]);

    return (
        <div className="chat">
            <SettingsBar chat={chat}/>
            <MessagesList messages={chatMessages}/>
            <MessageForm chatId={chatId}/>
        </div>
    );
};

export default ChatArea;