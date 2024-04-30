import React, { useContext } from 'react'
import { Container, Navbar } from 'react-bootstrap';
import { UserContext } from '../../context/context';
import { useNavigate } from "react-router-dom";

import "./Navbar.css";

export default function NavBar() {

    const navigate = useNavigate();

    const { isLoggedIn, username } = useContext(UserContext);
    return (
        <>
            {isLoggedIn && <Navbar className="navbar">
                <Container>
                    <Navbar.Brand className='nav-brand' style={{cursor: 'pointer'}} onClick={() => navigate("/dashboard")}> 🚘 C A R S _ 3 6 0</Navbar.Brand>
                    <Navbar.Toggle />
                    <Navbar.Collapse className="justify-content-end">
                        <Navbar.Text className='nav-text'>
                            Signed in as : {username}
                        </Navbar.Text>
                        {/* <Button onClick={() => logout()} variant="danger" className='mx-3' style={{width:'auto'}}>Logout</Button> */}
                    </Navbar.Collapse>
                </Container>
            </Navbar>}
        </>
    )
}
