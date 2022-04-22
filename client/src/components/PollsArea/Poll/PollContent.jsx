import React from "react";
import Form from "react-bootstrap/Form";

const createPollItemAnswers = (pollItem) => {
    return pollItem.answersType === "textInput"
        ? <Form.Control name={`${pollItem._id}_${pollItem.answersType}`} required/>
        : pollItem.answers.map(answer => (
            <Form.Check 
                key={answer._id} 
                name={`${pollItem._id}_${pollItem.answersType}`} 
                label={answer.variant} 
                value={`${answer.variant}_${answer._id}`} 
                type={pollItem.answersType}
            />
        ));
};

const PollContent = (props) => {
    const { pollItems } = props;

    if(pollItems.length === 0) return null;

    return pollItems.map(item => (
        <Form.Group key={item._id}>
            <h5 className="custom-details__form-title">{item.question}</h5>
            {createPollItemAnswers(item)}
        </Form.Group>
    ));
};

export default PollContent;