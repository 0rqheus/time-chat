import React from "react";
import { useSelector } from "react-redux";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";


const CreateTaskForm = ({membersIds, handleAssign}) => {
    const [ executor, setExecutor ] = React.useState(membersIds[0]);
    const [ description, setDescription ] = React.useState("");
    const d = new Date();
    const [ deadline, setDeadline ] = React.useState(`${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()} ${d.getHours()+1}:${d.getMinutes()}`);

    const user = useSelector(state => state.user);
    const jwt = useSelector(state => state.token);

    const createTask = (event) => {
        event.preventDefault();

        fetch("http://localhost:8000/api/tasks/create", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${jwt}`
            },
            body: JSON.stringify({
                executor: executor,
                assigner: user.id,
                description: description,
                deadline: deadline
            })
        })
            .catch(console.error);
    };


    return (
        <Form className="form" onSubmit={createTask}>
            <Form.Group className="form__group">
                <Form.Label>Select executor</Form.Label>
                <Form.Control as="select" value={executor} onChange={event => setExecutor(event.target.value)} required>
                    {membersIds.map(memberId => <option key={memberId}>{memberId}</option>)}
                </Form.Control>
            </Form.Group>

            <Form.Group className="form__group">
                <Form.Label>Description</Form.Label>
                <Form.Control as="textarea" rows={3} value={description} onChange={event => setDescription(event.target.value)} required />
            </Form.Group>

            <Form.Group className="form__group">
                <Form.Label>Deadline</Form.Label>
                <Form.Control type="datetime-local" value={deadline} onChange={event => setDeadline(event.target.value)} required />
            </Form.Group>

            <Button variant="primary" type="submit" onClick={handleAssign(false)}>
                Assign
            </Button>
        </Form>
    );
};

export default CreateTaskForm;
