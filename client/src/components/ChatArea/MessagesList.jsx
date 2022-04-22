import React from "react";
import { useSelector, useDispatch } from "react-redux";

import Message from "./Message";
import SelectedMenu from "../_partials/SelectedMenu/SelectedMenu";

const MessagesList = (props) => {

    const { messages } = props;
    const messageList = React.useRef(null);
    const selectedMessages = useSelector(state => state.selectedMessages);
    const jwt = useSelector(state => state.token);
    const dispatch = useDispatch();

    React.useEffect(() => {
        messageList.current.scrollTop = messageList.current.scrollHeight;
    }, [messages]);

    const messageElements = messages.map(msg => <Message key={msg._id} message={msg}/>);

    const handleAction = (actionType) => {

        if(actionType === "save") {

            fetch("http://localhost:8000/api/storage/add_messages", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${jwt}`
                },
                body: JSON.stringify({ids: selectedMessages, chatId: messages[0].chatId}),
            })
                .catch(console.error);
                
        } else if (actionType === "delete") {

            //@todo check on admin and delete from chat
            // fetch("/api/storage/delete_messages", {
            //     method: "POST",
            //     body: JSON.stringify({ids: selectedMessages})
            // })
            //     .catch(console.error);
        }

        dispatch({type: "MESSAGE_CLEAR_SELECTION"});
    };

    return (
        <>
            {
                selectedMessages.length 
                    ? <SelectedMenu amount={selectedMessages.length} action={handleAction}/>
                    : null
            }

            <ul ref={messageList} className="message-list">
                {messageElements}
            </ul>
        </>
    );
};

export default MessagesList;