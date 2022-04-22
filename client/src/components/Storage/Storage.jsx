import React from "react";
import { useSelector } from "react-redux";

import ListGroup from "react-bootstrap/ListGroup";

import "./storage.scss";

const StorageItem = ({chat}) => {
    return (
        <ListGroup.Item action href={`/storage/${chat.id}`}>
            <h5>{chat.name}</h5>
        </ListGroup.Item>
    );
};

const Storage = () => {

    const [storageChats, setStorageChats] = React.useState([]);
    const jwt = useSelector(state => state.token);
    const user = useSelector(state => state.user);

    React.useEffect(() => {

        fetch(`http://localhost:8000/api/storage/${user.id}`, {
            headers: { Authorization: `Bearer ${jwt}` }
        })
            .then(response => response.json())
            .then(storage => {
                setStorageChats(storage.chats.map(chat => <StorageItem key={chat.id} chat={chat}/>));
            })
            .catch(console.error);
            
    }, [jwt]);

    return (
        <ListGroup>
            {storageChats}
        </ListGroup>
    );
};

export default Storage;