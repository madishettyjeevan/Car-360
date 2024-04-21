import React, { useContext, useEffect, useState } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

import './dashbaord.css';
import { UserContext } from '../../context/context';
import PopUp from '../popup/popup';
import NavBar from '../Navbar/Navbar';

const Dashboard = () => {

    const { isLoggedIn } = useContext(UserContext);
    const navigate = useNavigate();

    const [popUpText, setPopUpText] = useState("");
    const [isPopUpOpen, setIsPopUpOpen] = useState(false);
    // eslint-disable-next-line
    const [isBackgroundBlurred, setIsBackgroundBlurred] = useState(false);
    const blurredBackgroundStyles = isBackgroundBlurred
        ? {
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(100, 100, 100, 0.5)",
            backdropFilter: "blur(1.8px)",
            zIndex: 1,
        }
        : {};

    useEffect(() => {
        if (!isLoggedIn) {
            setPopUpText("Unautharized..., Please Log in...");
            setIsPopUpOpen(true);
        }
    // eslint-disable-next-line
    }, []);

    return (
        <>
            <NavBar />

            <Container className="my-4 mx-auto  dashboard-container">
                <h2 className='text-center main_text'> Welcome to Cars_360, Rent or list your cars hassle-free. Drive or earn, it's all here! </h2>
                <Row className="mx-3 management-options">
                    <Col md={6} className='my-3'>
                        <h2 className='text-center sub_text'> List Your Cars!!! </h2>
                        <div className="sub-options">
                            <Button id="main_button" className='my-2 button' onClick={() => navigate(`/add-car`)}>Add Car</Button>
                            <Button id="main_button" className='my-2 button' onClick={() => navigate(`/view-listings`)}>View your listings</Button>
                        </div>
                    </Col>
                    <Col md={6} className='my-3'>
                        <h2 className='text-center sub_text'> Rent a Ride!!! </h2>
                        <div className="sub-options">
                            <Button id="main_button" className='my-2 button' onClick={() => navigate(`/view-bookings`)}>Ride History</Button>
                            <Button id="main_button" className='my-2 button' onClick={() => navigate(`/view-available`)}>Book a Car</Button>
                        </div>
                    </Col>
                </Row>
            </Container>

            {isBackgroundBlurred && <div style={blurredBackgroundStyles} />}
            <PopUp
                isOpen={isPopUpOpen}
                close={() => {
                    setIsPopUpOpen(false)
                    if(!isLoggedIn){
                        navigate("/");
                    }
                }}
                text={popUpText}
            />
        </>
    );
};




export default Dashboard;
