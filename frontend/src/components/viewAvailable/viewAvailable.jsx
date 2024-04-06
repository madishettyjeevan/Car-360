import { useContext, useEffect, useState } from 'react'
import { UserContext } from '../../context/context';
import NavBar from '../Navbar/Navbar';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import PopUp from '../popup/popup';
import Loader from '../loader/loader';

import axios from '../../axios';

export default function ViewAvailable({ setCarToBeBooked }) {

    const { userId, isLoggedIn } = useContext(UserContext)
    const navigate = useNavigate();

    const [cars, setCars] = useState([]);
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

    const fetchCars = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`/car/get-cars/except/${userId}`, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            setCars(response.data);
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

    const handleBookClick = async (car) => {
        setCarToBeBooked(car);
        navigate(`${car._id}`);
    }

    useEffect(() => {
        if (!isLoggedIn) {
            setPopUpText("Unautharized..., Please Log in...");
            setIsPopUpOpen(true);
        } else {
            fetchCars();
        }
    // eslint-disable-next-line
    }, []);

    return (
        <>
            <NavBar />

            <Container className="my-4 mx-auto  dashboard-container">
                <h2 className='text-left main_text my-1'>Get Behind the Wheel 🚗 🚗 🚗</h2>
                <hr />

                <Row>
                    {cars.length > 0 ? (
                        cars.map((car, index) => (
                            <Col xs={12} md={6} lg={4}>
                                <Card className="car-card my-3" key={index}>
                                    <Card.Img
                                        src={car.imageUrl}
                                        alt={`${car.brand} ${car.model}`}
                                        className="car-image"
                                        style={{ height: "200px", objectFit: "cover" }}
                                    />
                                    <Card.Body>
                                        <Card.Title>{car.brand} {car.model}</Card.Title>
                                        <Card.Text>{car.description.substring(0, 100)}...</Card.Text>
                                        <Card.Text>Hourly Rental: ${car.price}</Card.Text>
                                        <Row>
                                            <Col md={6}>
                                                <Card.Text>YoM: {car.year}</Card.Text>
                                            </Col>
                                            <Col md={6}>
                                                <Card.Text>Color: {car.color}</Card.Text>
                                            </Col>
                                        </Row>
                                        <Button id="main_button" className='button my-4' onClick={() => handleBookClick(car)}>Book Now</Button>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))
                    ) : (
                        <p>We are sorry, no cars are available at the moment. 🥹🥹</p>
                    )}
                </Row>
            </Container>

            {isBackgroundBlurred && <div style={blurredBackgroundStyles} />}
            {loading && <Loader />}
            <PopUp
                isOpen={isPopUpOpen}
                close={() => {
                    setIsPopUpOpen(false)
                    if (!isLoggedIn) {
                        navigate("/");
                    }
                }}
                text={popUpText}
            />
        </>
    )
}
