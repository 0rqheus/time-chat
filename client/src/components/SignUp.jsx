import React from "react";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

import "./form.scss";

const SignUp = () => {

    const history = useHistory();
    const [ login, setLogin ] = React.useState("");
    const [ username, setUsername ] = React.useState("");
    const [ password, setPassword ] = React.useState("");

    const [ loginIsFree, setIsLoginFree ] = React.useState(true);
    const dispatch = useDispatch();

    const falseLoginError = () => {
        setIsLoginFree(false);

        return null;
    };

    const handleSignUp = (event) => {
        event.preventDefault();

        fetch("http://localhost:8000/api/auth/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json;charset=utf-8"
            },
            body: JSON.stringify({ login, password, username })
        })
            .then(response => response.status === 400
                ? falseLoginError()
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

        <Form onSubmit={handleSignUp} className="form">

            <h3 className="form__header">Sign up</h3>

            <Form.Group className="form__group">
                <Form.Label>Email</Form.Label>
                <Form.Control type="email" placeholder="your.email@example.com" value={login} onChange={(event) => setLogin(event.target.value)} required/>

                { !loginIsFree &&
                    <Form.Text className="text-error">
                        This login is already in use
                    </Form.Text>
                }
            </Form.Group>

            <Form.Group className="form__group">
                <Form.Label>Username</Form.Label>
                <Form.Control placeholder="Ty1er" value={username} onChange={(event) => setUsername(event.target.value)}/>
            </Form.Group>

            <Form.Group className="form__group">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" value={password} onChange={(event) => setPassword(event.target.value)} required/>
            </Form.Group>

            <Button type="submit">Sign up</Button>

        </Form>
    );
};

export default SignUp;