import React from "react";
import NavDropdown from "react-bootstrap/NavDropdown";

const AnonMenu = () => {
    return (
        <>
            <NavDropdown.Item href="/signup">Sign up</NavDropdown.Item>
            <NavDropdown.Item href="/login">Log in</NavDropdown.Item>
        </>
    );
};

export default AnonMenu;