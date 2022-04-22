import React from "react";
import { useSelector, useDispatch } from "react-redux";

const Message = ({message}) => {

    const sender = message.sender;
    const user =  useSelector(state => state.user);
    const selectedMessages = useSelector(state => state.selectedMessages);
    const dispatch = useDispatch();

    const isSelected = (items, item) => items.includes(item);

    const selectMessage = (event) => {



        if (event.target.classList.contains("message-list__item")) {
            isSelected(selectedMessages, message._id)
                ? dispatch({ type: "MESSAGE_DESELECT", messageId: message._id })
                : dispatch({ type: "MESSAGE_SELECT", messageId: message._id });
        }
    };

    return (
        <li 
            className={
                "message-list__item" + (sender?._id === user.id ? " message-list__item_my" : "") + (isSelected(selectedMessages, message._id) ? " message-list__item_selected" : "") 
            } 
            onClick={selectMessage}
        >

            <img src={sender?.photoUrl} alt="user avatar" className="message-list__sender-avatar" />

            <div className={"message" + (sender?._id === user.id ? " message_my" : " message_not-my")}>
                <b>{sender?.username}</b>
                <p className="message__text">{message.text}</p>
            </div>

        </li>
    );
};

export default Message;