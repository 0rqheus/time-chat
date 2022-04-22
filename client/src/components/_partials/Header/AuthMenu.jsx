import React from "react";
import NavDropdown from "react-bootstrap/NavDropdown";
import { useDispatch } from "react-redux";

const AuthMenu = () => {

    const dispatch = useDispatch();

    const logout = () => {
        localStorage.removeItem("jwt");
        localStorage.removeItem("user");
        dispatch({type: "USER_LOGOUT"});
        dispatch({type: "TOKEN_SET", token: ""});
    };

    return <NavDropdown.Item href="/" onClick={logout}>Logout</NavDropdown.Item>;
};

export default AuthMenu;