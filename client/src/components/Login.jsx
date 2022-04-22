import React from "react";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

import "./form.scss";

const Login = () => {

    const history = useHistory();
    const [ login, setLogin ] = React.useState("");
    const [ password, setPassword ] = React.useState("");

    const [ incorrectRequisites, setIncorrectRequisites ] = React.useState(false);
    const dispatch = useDispatch();

    const handleLoginError = () => {
        setIncorrectRequisites(true);
        return null;
    };

    const handleLogin = (event) => {
        event.preventDefault();

        fetch("http://localhost:8000/api/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json;charset=utf-8"
            },
            body: JSON.stringify({ login, password })
        })
            .then(response => response.status === 400
                ? handleLoginError()
                : response.json())
            .then(result => {

                if(result) {
                    console.log(result);
                    
                    localStorage.setItem("jwt", result.token);
                    localStorage.setItem("user", JSON.stringify(result.partialUser));

                    dispatch({type: "USER_LOGIN", user: result.partialUser});
                    dispatch({type: "TOKEN_SET", token: result.token});

                    history.push("/");
                }
            })
            .catch(console.error);
    };

    return (

        <Form onSubmit={handleLogin} className="form">

            <h3 className="form__header">Login</h3>

            <Form.Group className="form__group">
                <Form.Label>Email</Form.Label>
                <Form.Control type="email" value={login} onChange={(event) => setLogin(event.target.value)} required/>
            </Form.Group>

            <Form.Group className="form__group">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" value={password} onChange={(event) => setPassword(event.target.value)} required/>
            </Form.Group>

            { incorrectRequisites &&
                <Form.Text className="text-error">
                    email and/or password are incorrect.
                </Form.Text>
            }

            <Button type="submit">Log In</Button>

        </Form>
    );
};

export default Login;