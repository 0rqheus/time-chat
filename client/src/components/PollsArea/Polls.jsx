import React from "react";
import { useSelector, useDispatch } from "react-redux";

import SelectedMenu from "../_partials/SelectedMenu/SelectedMenu";
import Poll from "./Poll/Poll";
import Result from "./Result/Result";

const Polls = (props) => {

    const { polls } = props;
    const user = useSelector(state => state.user);
    const selectedPolls = useSelector(state => state.selectedPolls);
    const jwt = useSelector(state => state.token);
    const dispatch = useDispatch();

    const chatPolls = polls.map(poll => poll.votedUsers.includes(user.id)
        ? <Result key={poll._id} poll={poll}/>
        : <Poll key={poll._id} poll={poll}/>
    );

    const handleAction = (actionType) => {

        if(actionType === "save") {

            fetch("http://localhost:8000/api/storage/add_polls", {
                method: "POST",
                body: JSON.stringify({ids: selectedPolls, chatId: polls[0].chatId}),
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${jwt}`
                },
            })
                .catch(console.error);
                
        } else if (actionType === "delete") {

            fetch("http://localhost:8000/api/storage/delete_polls", {
                method: "POST",
                body: JSON.stringify({ids: selectedPolls}),
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${jwt}`
                },
            })
                .catch(console.error);
        }

        dispatch({type: "POLL_CLEAR_SELECTION"});
    };

    return (
        <div className="polls">
            {
                selectedPolls.length 
                    ? <SelectedMenu amount={selectedPolls.length} action={handleAction}/>
                    : null
            }
            {chatPolls}
        </div>
    );
};

export default Polls;