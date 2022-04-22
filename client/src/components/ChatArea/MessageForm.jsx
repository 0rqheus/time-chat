import React from "react";
import { useSelector } from "react-redux";
import socket from "../../socket";

import Form from "react-bootstrap/Form";

import attachFileIcon from "../../assets/clip.svg";
import sendIcon from "../../assets/send.png";

const MessageForm = (props) => {
    
    const [ messageText, setMessageText ] = React.useState("");
    const user = useSelector(state => state.user);

    const sendMessage = () => {
        if(messageText !== "") {
            socket.emit("new message", {
                chatId: props.chatId, 
                senderId: user.id, 
                text: messageText
            });
            setMessageText("");
        }
    };

    return (
        <Form className="message-form" onSubmit={(event) => event.preventDefault()}>
            <img className="options-icon" src={attachFileIcon} alt="add file"/>

            <Form.Control 
                className="message-form__textarea"
                as="textarea"
                rows="2" 
                value={messageText} 
                onChange={event => setMessageText(event.target.value)} 
            />

            <img className="message__send-icon" src={sendIcon} alt="send" onClick={sendMessage}/>
        </Form>
    );
};

export default MessageForm;