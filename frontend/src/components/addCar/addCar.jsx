import { Form, Button, Row, Col } from 'react-bootstrap';
import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { UserContext } from '../../context/context';
import Loader from '../../components/loader/loader';
import PopUp from "../../components/popup/popup";
import NavBar from "../Navbar/Navbar";
import axios from '../../axios';

import './addCar.css';

const AddCar = () => {

    const { userId, isLoggedIn } = useContext(UserContext)
    const navigate = useNavigate()
    const [isPopUpOpen, setIsPopUpOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [popUpText, setPopUpText] = useState("");
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

    const handleSubmit = async (e) => {
        try {
            e.preventDefault();
            const formData = new FormData(e.target);
            setLoading(true);
            // eslint-disable-next-line
            const response = await axios.post(`/car/add-car/${userId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            setPopUpText("Car Added Successfully");
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
    };

    return (
        <>
            <NavBar />
            <Row className="my-1 mx-5 add-car-container">
                <Col md={12} className="add-car-sub-container">
                    <h2 className="main_text text-center">Add Your Car to Our Fleet, Now!!!</h2>
                    <Form className="add-car-form" onSubmit={handleSubmit}>
                        <Row>
                            <Col xs={12} md={6}>
                                <Form.Group controlId="brand">
                                    <Form.Label>Brand</Form.Label>
                                    <Form.Control type="text" name="brand" required />
                                </Form.Group>
                                <Form.Group controlId="model">
                                    <Form.Label>Model</Form.Label>
                                    <Form.Control type="text" name="model" required />
                                </Form.Group>
                                <Form.Group controlId="color">
                                    <Form.Label>Color</Form.Label>
                                    <Form.Control type="text" name="color" required />
                                </Form.Group>
                            </Col>
                            <Col xs={12} md={6}>
                                <Form.Group controlId="price">
                                    <Form.Label>Price</Form.Label>
                                    <Form.Control type="text" name="price" required />
                                </Form.Group>
                                <Form.Group controlId="year">
                                    <Form.Label>Year of Manufacture</Form.Label>
                                    <Form.Control type="number" name="year" required />
                                </Form.Group>
                                <Form.Group controlId="image">
                                    <Form.Label>Car Image</Form.Label>
                                    <Form.Control type="file" name="carImage" accept="image/*" required />
                                </Form.Group>
                            </Col>
                            <Form.Group controlId="description">
                                <Form.Label>Description</Form.Label>
                                <Form.Control as="textarea" name='description' rows={3} />
                            </Form.Group>
                        </Row>
                        <div className="text-center">
                            <Button className='my-4' id="main_button" type="submit">Add Car</Button>
                        </div>
                    </Form>
                </Col>
            </Row>

            {isBackgroundBlurred && <div style={blurredBackgroundStyles} />}
            {loading && <Loader />}
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



export default AddCar;
