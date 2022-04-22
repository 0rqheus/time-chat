import React from "react";
import { useSelector } from "react-redux";

import Table from "react-bootstrap/Table";

import "./tasks.scss";

const TasksItem = ({ task }) => {

    const d = new Date(task.deadline);
    return (
        <tr>
            <td>{task.assigner}</td>
            <td>{task.description}</td>
            <td>{`${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()} ${d.getHours()+1}:${d.getMinutes()}`}</td>
        </tr>
    );
};

const Tasks = () => {

    const [tasks, setTasks] = React.useState([]);
    const jwt = useSelector(state => state.token);

    React.useEffect(() => {

        fetch("http://localhost:8000/api/tasks/my", {
            headers: { Authorization: `Bearer ${jwt}` }
        })
            .then(response => response.json())
            .then(myTasks => {

                console.log(myTasks);
                setTasks(myTasks.map(task => <TasksItem key={task._id} task={task} />));
            }
            )
            .catch(console.error);
    }, [jwt]);

    return (
        <Table bordered hover variant="dark" className="tasks">
            <thead>
                <tr>
                    <th>Assigner</th>
                    <th>Description</th>
                    <th>Deadline</th>
                </tr>
            </thead>
            <tbody>
                {tasks}
            </tbody>
        </Table>
    );
};

export default Tasks;