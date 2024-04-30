import React, { useContext, useEffect, useState } from 'react'
import { Container, Row, Col, Button, Image, Form } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';

import NavBar from '../Navbar/Navbar'
import { UserContext } from '../../context/context';
import PopUp from '../popup/popup';
import Loader from '../loader/loader';
import axios from '../../axios';

import "./bookCar.css";

export default function BookCar({ setBookingData, carToBeBooked }) {
    const { userId, isLoggedIn } = useContext(UserContext);
    const { carId } = useParams();
    const navigate = useNavigate();

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
        e.preventDefault();
        const formData = new FormData(e.target);
        const bookingData = {
            hours: formData.get('hours'),
            ...carToBeBooked
        }
        setBookingData(bookingData);
        navigate(`/book-car/payment/${carId}`);
    }

    return (
        <>
            <NavBar />

            <Container className='my-4 mx-auto dashboard-container'>
                <Row>
                    <Col className="d-flex justify-content-center half_container my-5" xs={12} md={6}>
                        <Image className='my-auto mx-2' src={carToBeBooked.imageUrl} alt="Car" fluid style={{ height: "300px", objectFit: "cover" }}/>
                    </Col>
                    <Col className="half_container my-5" xs={12} md={6}>
                        <h1 className='mx-2 my-1'>{carToBeBooked.brand} {carToBeBooked.model}</h1>
                        <p className='book_text'>Year Of Manufacture 🛠️: {carToBeBooked.year}</p>
                        <p className='book_text'>Color 🌈: {carToBeBooked.color}</p>
                        <p className='book_text'>Description 📜: {carToBeBooked.description}</p>
                        <h4 className='mx-2 my-1'>Price : 💲{carToBeBooked.price} (per Hour)</h4>

                        <h3 className='mt-5 text-center' style={{ color: '#5D54A4' }}>Book Now ❗❗❗</h3>
                        <Form onSubmit={bookCar} className='my-5'>
                            <Row>
                                <Col className="my-2" xs={12} md={6} lg={6}>
                                    <Form.Group controlId="startDate">
                                        <Form.Control required min="1" type="number" name="hours" placeholder="No. of hours" className="no-spinner"/>
                                    </Form.Group>
                                </Col>
                                <Col className="my-2" xs={12} md={6} lg={6}>
                                    <Button id="main_button" type='submit'>Book</Button>
                                </Col>
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
                    navigate(-1);
                    if (!isLoggedIn) {
                        navigate("/");
                    }
                }}
                text={popUpText}
            />
        </>
    )
}
