import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

import "./form.scss";

const CreateChat = () => {

    const history = useHistory();
    const [ chatName, setChatName ] = useState("");
    const d = new Date();
    const [ chatEnd, setChatEnd ] = useState(`${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()} ${d.getHours()+1}:${d.getMinutes()}`);
    
    const user = useSelector(state => state.user);
    const jwt = useSelector(state => state.token);
    
    const createChat = (event) => {
        event.preventDefault();

        fetch("http://localhost:8000/api/chats/create", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${jwt}`
            },
            body: JSON.stringify({
                name: chatName,
                creatorId: user.id,
                endDateTime: chatEnd
            })
        })
            .then(response => response.json())
            .then(chat => history.push(`/chats/${chat._id}`))
            .catch(console.error);
    };

    return (
        <Form className="form" onSubmit={createChat}>

            <h3 className="form__header">Create chat</h3>

            <Form.Group className="form__group">
                <Form.Label>Chat name</Form.Label>
                <Form.Control value={chatName} onChange={event => setChatName(event.target.value)} required/>
            </Form.Group>

            <Form.Group className="form__group">
                <Form.Label>End Date and Time</Form.Label>
                <Form.Control type="datetime-local" value={chatEnd} onChange={event => setChatEnd(event.target.value)} required/>
            </Form.Group>

            <Button variant="primary" type="submit">
                Create chat
            </Button>

        </Form>
    );
};

export default CreateChat;