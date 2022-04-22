import React from "react";
import { useSelector } from "react-redux";
import socket from "../../socket";

import PollsConstructor from "./PollsConstructor";
import Polls from "./Polls";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";

import "./pollsArea.scss";

const PollsArea = (props) => {

    const { chatId } = props;
    const [ polls, setPolls ] = React.useState([]);
    const jwt = useSelector(state => state.token);

    React.useEffect(() => {

        fetch(`http://localhost:8000/api/chats/${chatId}/polls_history`, {
            headers: { Authorization: `Bearer ${jwt}` }
        })
            .then(response => response.json())
            .then(polls => {
                if(polls.length !== 0)
                    setPolls(polls);
            })
            .catch(console.error);

    }, [chatId, jwt]);


    React.useEffect(() => {
        socket.on("new poll", (poll) => {
            setPolls([...polls, poll]);
        });
    }, [polls, setPolls]);

    React.useEffect(() => {

        //@todo figure out why it doesn't update and fix it
        socket.on("update poll results", (updatedPoll) => {
            console.log(polls);
            console.log(updatedPoll);
    
            const newPolls = polls.slice();
    
            const pos = newPolls.findIndex(poll => poll._id === updatedPoll._id);
            newPolls[pos] = updatedPoll;
    
            console.log(pos);
            console.log(newPolls);
            console.log("\n\n");
    
            setPolls(newPolls);
        });

        return () => socket.off("update poll results");
    }, [polls, setPolls]);


    return (
        <div className="polls-area">
            <Tabs defaultActiveKey="polls">
                <Tab eventKey="polls" title="Polls" className="overflow-test">
                    <Polls polls={polls} />
                </Tab>
                <Tab eventKey="polls_constructor" title="Constructor">
                    <PollsConstructor chatId={chatId} />
                </Tab>
            </Tabs>
        </div>
    );

};

export default PollsArea;