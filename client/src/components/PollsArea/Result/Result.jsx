import React from "react";
import { useSelector, useDispatch } from "react-redux";

import Form from "react-bootstrap/Form";
import Chart from "./Chart";
import List from "./List";

const Result = (props) => {

    const data = props.poll.data;
    const id = props.poll._id;
    const [chosenItem, setChosenItem] = React.useState(data[0]);
    const selectedPolls = useSelector(state => state.selectedPolls);
    const dispatch = useDispatch();
    
    
    const selectOption = (event) => {
        const value = event.target.value;
        setChosenItem(data.find(item => item.question === value));
    };
    
    const isSelected = (items, item) => {
        return items.includes(item);
    };
    
    const selectResult = (event) => {
        // console.log(selectedPolls);

        if(event.target.classList.contains("result")) {
            isSelected(selectedPolls, id)
                ? dispatch({type: "POLL_DESELECT", pollId: id})
                : dispatch({type: "POLL_SELECT", pollId: id});
        }
    };

    const options = data.map(item => <option key={item.question}>{item.question}</option>);
    
    return (
        <div className={`result ${isSelected(selectedPolls, id) ? "result_selected" : ""}`} onClick={selectResult}>
            <Form>
                <Form.Label>Select question:</Form.Label>
                <Form.Control as="select" onChange={selectOption}>
                    {options}
                </Form.Control>
            </Form>

            {
                chosenItem.answersType === "textInput"
                    ? <List item={chosenItem} />
                    : <Chart item={chosenItem} />
            }

        </div>
    );
};

export default Result;