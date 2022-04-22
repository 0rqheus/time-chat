import React from "react";
import { useSelector } from "react-redux";

import AnonMenu from "./AnonMenu";
import AuthMenu from "./AuthMenu";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import NavDropdown from "react-bootstrap/NavDropdown";

const Header = () => {
    const user = useSelector(state => state.user);

    return (
        <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
            <Navbar.Brand href="/">Tmp Chat</Navbar.Brand>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav">
                <Nav className="mr-auto">
                    <Nav.Link href="/chats">Chats</Nav.Link>
                    <Nav.Link href="/storage">Storage</Nav.Link>
                    <Nav.Link href="/tasks">Tasks</Nav.Link>
                </Nav>
                <Nav>
                    <NavDropdown title="Auth" id="collasible-nav-dropdown">
                        {
                            user.id
                                ? <AuthMenu/>
                                : <AnonMenu/>
                        }
                    </NavDropdown>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    );
};

export default Header;