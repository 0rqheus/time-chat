import React from "react";
import { useSelector } from "react-redux";
import socket from "../../socket";
import PollContent from "./Poll/PollContent";

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";

const PollsConstructor = (props) => {

    const [pollItems, setPollItems] = React.useState([]);
    const [answers, setAnswers] = React.useState([]);

    const [question, setQuestion] = React.useState("");
    const [answersType, setAnswersType] = React.useState("radio");
    const [answer, setAnswer] = React.useState("");
    const user = useSelector(state => state.user);

    const resetData = () => {
        setAnswers([]);
        setQuestion("");
        setAnswersType("radio");
        setAnswer("");
    };

    const appendQuestion = (event) => {
        event.preventDefault();

        setPollItems([
            ...pollItems,
            { question, answersType, answers }
        ]);

        resetData();
    };

    const addAnswer = (event) => {
        event.preventDefault();
        setAnswers([ ...answers, { variant: answer, votes: 0 } ]);
        setAnswer("");
    };

    const createPoll = () => {
        socket.emit("new poll", {
            chatId: props.chatId,
            creatorId: user.id,
            data: pollItems
        });
        resetData();
        setPollItems([]);
    };


    const PreviewAnswers = () => {
        if (answersType === "textInput")
            return <Form.Control label={answer.variant} />;
        else
            return answers.map(answerData => (
                <Form.Check key={answerData._id} type={answersType} label={answerData.variant} />
            ));
    };


    return (
        <div className="constructor">

            <Form className="create-poll-form" onSubmit={appendQuestion}>

                <Form.Group>

                    {/* Question */}
                    <Form.Row>
                        <Col xs={9}>
                            <Form.Control
                                className="create__question"
                                placeholder="Enter question"
                                value={question}
                                onChange={event => setQuestion(event.target.value)}
                            />
                        </Col>

                        <Col>
                            <Form.Control
                                as="select"
                                className="create__answers-type"
                                value={answersType}
                                onChange={event => setAnswersType(event.target.value)}
                                custom
                            >
                                <option value="radio">radio</option>
                                <option value="checkbox">checkbox</option>
                                <option value="textInput">text input</option>
                            </Form.Control>
                        </Col>
                    </Form.Row>

                    <br />

                    {/* Answer */}
                    <Form.Row style={answersType === "textInput" ? { display: "none" } : {}}>
                        <Col xs={11}>
                            <Form.Control
                                className="create__answer-text"
                                placeholder="Enter answer:"
                                value={answer}
                                onChange={event => setAnswer(event.target.value)}
                            />
                        </Col>

                        <Button variant="primary" type="submit" onClick={addAnswer}>
                            +
                        </Button>
                    </Form.Row>

                </Form.Group>

                <Button variant="primary" type="submit" className="polls-btn">
                    Append question
                </Button>

            </Form>


            <div className="previews">

                <details className="custom-details" open>

                    <summary className="custom-details__title">Question preview</summary>

                    <Form className="custom-details__form">
                        <h5 className="custom-details__form-title">{question}</h5>
                        <PreviewAnswers />
                    </Form>

                </details>



                <details className="custom-details" open>

                    <summary className="custom-details__title">Poll preview</summary>

                    <Form className="custom-details__form">
                        <PollContent pollItems={pollItems}/>
                    </Form>

                </details>

            </div>




            <Button variant="primary" className="polls-btn" onClick={createPoll}>
                Create poll
            </Button>

        </div>
    );
};

export default PollsConstructor;