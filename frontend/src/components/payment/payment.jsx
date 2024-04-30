import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import NavBar from '../Navbar/Navbar'
import { UserContext } from '../../context/context';
import PopUp from '../popup/popup';
import Loader from '../loader/loader';
import axios from '../../axios';
import { Container, Row, Col, Form, Button, Image } from 'react-bootstrap';


export default function Payment({ bookingData }) {

    const navigate = useNavigate();
    const { userId, isLoggedIn } = useContext(UserContext);
    const { carId } = useParams();

    const [loading, setLoading] = useState(false);
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

    const bookCar = async (e) => {
        try {
            e.preventDefault();
            const dataToBeSent = {
                hours: bookingData.hours
            }
            setLoading(true);
            const response = await axios.post(`/booking/book/${userId}/${carId}`, dataToBeSent, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            setPopUpText(response.data.message);
            setIsPopUpOpen(true);
        } catch (error) {
            console.log(error);
            if (error?.response?.data?.message) {
                setPopUpText(error?.response?.data?.message);
            }
            else {
                setPopUpText("Something Went Wrong")
            }
            setIsPopUpOpen(true);
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <NavBar />

            <Container className='my-4 mx-auto dashboard-container'>
                <Row>
                    <Col>
                        <Image className='my-auto mx-2' src={bookingData.imageUrl} alt="Car" fluid style={{ height: "300px", objectFit: "cover" }} />
                        <h3 className='my-1'>{bookingData.brand} {bookingData.model}</h3>
                        <p>Booking Time: {bookingData.hours} hours</p>
                        <p>Total Cost: {bookingData.hours * bookingData.price} INR</p>
                    </Col>
                    <Col md={6}>
                        <Form onSubmit={bookCar}>
                            <Form.Group className='my-3' controlId="formName">
                                <Form.Label>Name(as on card)</Form.Label>
                                <Form.Control name="name" type="text" placeholder="Enter your name" required />
                            </Form.Group>
                            <Form.Group className='my-3' controlId="formAddress">
                                <Form.Label>Address</Form.Label>
                                <Form.Control name="address" type="text" placeholder="Enter your address" required />
                            </Form.Group>
                            <Form.Group className='my-3' controlId="formCardNumber">
                                <Form.Label>Card Number</Form.Label>
                                <Form.Control name="cardNumber" type="text" placeholder="Enter your card number" required />
                            </Form.Group>
                            <Row className='my-3'>
                                <Col md={6}>
                                    <Form.Label>Expiry date</Form.Label>
                                    <Form.Control type="date" placeholder="Enter your card number" required />
                                </Col>
                                <Col md={6}>
                                    <Form.Label>CVV</Form.Label>
                                    <Form.Control type="password" placeholder="Enter your cvv" required />
                                </Col>
                            </Row>
                            <Row className='my-3'>
                                <Button type="submit" id="main_button"> Proceed to Book </Button>
                            </Row>
                        </Form>
                    </Col>
                </Row>
            </Container>
            {isBackgroundBlurred && <div style={blurredBackgroundStyles} />}
            {loading && <Loader />}
            <PopUp
                isOpen={isPopUpOpen}
                close={() => {
                    setIsPopUpOpen(false);
                    if (isLoggedIn) {
                        navigate(-2);
                    }
                    if (!isLoggedIn) {
                        navigate("/");
                    }
                }}
                text={popUpText}
            />
        </>
    )
}
