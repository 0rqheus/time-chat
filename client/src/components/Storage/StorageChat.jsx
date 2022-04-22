import React from "react";
import { useSelector } from "react-redux";

import MessagesList from "../ChatArea/MessagesList";
import Polls from "../PollsArea/Polls";
import "./storage.scss";

const StorageChat = (props) => {

    const chatId = props.match.params.chatId;
    
    const [messages, setMessages] = React.useState([]);
    const [polls, setPolls] = React.useState([]);
    const user = useSelector(state => state.user);
    const jwt = useSelector(state => state.token);

    const getMessages = (messageIds) => {
        fetch("http://localhost:8000/api/storage/get_messages", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${jwt}`
            },
            body: JSON.stringify({ids: messageIds})
        })
            .then(response => response.json())
            .then(messages => setMessages(messages))
            .catch(console.error);
    };

    const getPolls = (pollIds) => {
        fetch("http://localhost:8000/api/storage/get_polls", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${jwt}`
            },
            body: JSON.stringify({ids: pollIds})
        })
            .then(response => response.json())
            .then(polls => setPolls(polls))
            .catch(console.error);
    };

    React.useEffect(() => {
        console.log(chatId);

        fetch(`http://localhost:8000/api/storage/${user.id}/chat/${chatId}`, {
            headers: { Authorization: `Bearer ${jwt}` }
        })
            .then(response => response.json())
            .then(storageChat => {
                getMessages(storageChat.selectedMessages);
                getPolls(storageChat.selectedPolls);
            })
            .catch(console.error);
    }, [user, jwt]);


    return (
        <div className="storage-chat">
            <div style={{width: "50%", borderRight: "3px solid black"}}>
                <MessagesList messages={messages}/>    
            </div>
            <div style={{width: "50%"}}>
                <Polls polls={polls} />
            </div>
        </div>
    );
};

export default StorageChat;