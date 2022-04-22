import React, { useCallback, useEffect} from "react";
import { useSelector } from "react-redux";

import ListGroup from "react-bootstrap/ListGroup";
import Button  from "react-bootstrap/Button";

import "./chats.scss";

const ChatsItem = ({chat}) => {

    console.log(chat.lastMessage);

    return (
        <ListGroup.Item action href={`/chats/${chat._id}`}>
            <h5>{chat.name}</h5>
            {chat.lastMessage !== null
                ? <p className="chats-message"><b>{chat.lastMessage.sender.username}:</b> {chat.lastMessage.text}</p>
                : <p className="chats-message"><b>No history...</b></p> }
            
        </ListGroup.Item>
    );
};

const Chats = () => {

    const [chats, setChats] = React.useState([]);
    const jwt = useSelector(state => state.token);

    useEffect(() => {

        fetch("http://localhost:8000/api/chats/my", {
            headers: { Authorization: `Bearer ${jwt}` }
        })
            .then(response => response.json())
            .then(myChats =>{
                // console.log(myChats);
                setChats(myChats.map(chat => <ChatsItem key={chat._id} chat={chat}/>));
            })
            .catch(console.error);
    }, [jwt]);

    const handleClick = useCallback(() => window.open("/chats/create"));
    
    return (
        <>
            <ListGroup>
                {chats.length 
                    ? chats
                    : <h1 className="no-items">No items</h1>}
                <Button onClick={handleClick} className="create-button">
                         Create chat
                </Button>
            </ListGroup>
        </>
    );
};

export default Chats;