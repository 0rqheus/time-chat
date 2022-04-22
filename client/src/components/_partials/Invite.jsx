import React from "react";
import { useHistory } from "react-router-dom";
import Loader from "./Loader/Loader";

const Invite = (props) => {

    const chatId = props.match.params.id;
    const joinCode = props.match.params.code;
    const jwt = localStorage.getItem("jwt");
    const history = useHistory();

    React.useEffect(() => {

        fetch(`http://localhost:8000/api/chats/${chatId}/join?code=${joinCode}`, {
            headers: { Authorization: `Bearer ${jwt}` }
        })
            .then(response => response.status === 200
                ? history.push(`/chats/${chatId}`)
                : history.push("/")
            )
            .catch(console.error);

    }, [chatId, joinCode, history, jwt]);

    return (
        <div style={{height: "98vh", width: "98vw", display: "flex", flexAlign: "center"}}>
            <Loader/>
        </div>
    );
};

export default Invite;