import React, { useCallback } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";

import Dropdown from "react-bootstrap/Dropdown";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

import CreateTaskForm from "./CreateTaskForm";

const SettingsBar = (props) => {

    const { chat } = props;
    const history = useHistory();
    const jwt = useSelector(state => state.token);

    const [taskModalShow, setTaskModalShow] = React.useState(false);

    const [inviteModalShow, setInviteModalShow] = React.useState(false);
    const [inviteLink, setInviteLink] = React.useState("Getting link...");

    const handleClick = useCallback(() => setTaskModalShow(false),[setTaskModalShow]);

    const leave = () => {
        fetch(`http://localhost:8000/api/chats/${chat._id}/leave`, {
            method: "POST",
            headers: { Authorization: `Bearer ${jwt}` }
        })
            .then(() => history.push("/"))
            .catch(console.error);
    };

    const getIntiveLink = () => {
        fetch(`http://localhost:8000/api/chats/${chat._id}/get_invite_link`, {
            headers: { Authorization: `Bearer ${jwt}` }
        })
            .then(response => response.json())
            .then(code => setInviteLink(code))
            .catch(console.error);
    };

    const copyCode = () => {
        if (!navigator.clipboard) {
            console.error("copy error");
            return;
        }
        navigator.clipboard.writeText(inviteLink).then(
            () => console.log("Async: Copying to clipboard was successful!"),
            (err) => console.error("Async: Could not copy text: ", err)
        );
    };



    return (
        <>
            <div className="settings-panel">
                <h4>{chat.name}</h4>

                <Dropdown>
                    <Dropdown.Toggle>
                        Settings
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                        <Dropdown.Item onClick={() => {
                            getIntiveLink();
                            setInviteModalShow(true);
                        }}>
                            Invite link
                        </Dropdown.Item>
                        <Dropdown.Item onClick={() => setTaskModalShow(true)}>
                            Assign task
                        </Dropdown.Item>
                        <Dropdown.Item onClick={leave} href="/">Leave</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </div>

            <Modal show={inviteModalShow} onHide={() => setInviteModalShow(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Invite link</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p className="invite-text">{inviteLink}</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={copyCode}>
                        Copy
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal show={taskModalShow} onHide={() => setTaskModalShow(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Assign new task</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <CreateTaskForm membersIds={chat.members} handleAssign={() => handleClick}/>
                </Modal.Body>
            </Modal>
        </>
    );
};

export default SettingsBar;