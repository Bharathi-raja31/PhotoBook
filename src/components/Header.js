import React from 'react';

// Bootstrap Components
import { Nav, Navbar, NavDropdown, Container } from 'react-bootstrap';

// Assets
const siteLogo = require('../assets/img/site-logo.png');

const Navigation = () => {
    return (
        <header className="app-header">
            <>
                <Navbar bg="light" expand="lg">
                    <Container>
                        <Navbar.Brand href="/">
                            <img src={siteLogo} alt="Logo" />
                        </Navbar.Brand>
                        <Navbar.Toggle aria-controls="basic-navbar-nav" />
                        <Navbar.Collapse id="basic-navbar-nav">
                            <Nav className="ml-auto">
                                <Nav.Link href="/about-app">About App</Nav.Link>
                                <NavDropdown title="Bharathi" id="basic-nav-dropdown">
                                    <NavDropdown.Item href="#action/3.2">Profile</NavDropdown.Item>
                                    <NavDropdown.Item href="#action/3.3">Settings</NavDropdown.Item>
                                    <NavDropdown.Item href="#action/3.4">Logout</NavDropdown.Item>
                                </NavDropdown>
                            </Nav>
                        </Navbar.Collapse>
                    </Container>
                </Navbar>
            </>
        </header>
    )
}

export default Navigation;