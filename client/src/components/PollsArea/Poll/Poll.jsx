/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { useSelector } from "react-redux";
import socket from "../../../socket";

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import PollContent from "./PollContent";

const Poll = ({ poll }) => {

    const user = useSelector(state => state.user);

    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (event, pollId) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const formEntries = Array.from(formData.entries()); // [ [id], [value] ]

        const chosenAnswers = formEntries
            .map(item => {

                const [questionId, answersType] = item[0].split("_");
                const [variant, answerId ] = item[1].split("_");
                return { questionId, answerId, answersType, variant };
            });

        socket.emit("poll vote", {
            userId: user.id, 
            pollId: pollId, 
            choices: chosenAnswers
        });

        window.location.reload();
    };


    return (
        <Form id={poll._id} className="poll" onSubmit={(event) => handleSubmit(event, poll._id)}>
            <PollContent pollItems={poll.data}/>

            <Button variant="primary" className="polls-btn" type="submit">
                Submit
            </Button>
        </Form>
    );

};

export default Poll;