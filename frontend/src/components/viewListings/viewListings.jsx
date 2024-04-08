import { useContext, useEffect, useState } from 'react'
import { UserContext } from '../../context/context';
import NavBar from '../Navbar/Navbar';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card } from 'react-bootstrap';
import PopUp from '../popup/popup';
import Loader from '../loader/loader';

import axios from '../../axios';

export default function ViewListings() {

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
            const response = await axios.get(`/car/get-cars/only/${userId}`, {
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
                <h2 className='text-left main_text my-1'> Your Car Portfolio 🎊🎉 </h2>
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
                                        {
                                            !car.currentlyBooked ?
                                                <Card.Text>Current Status: <span style={{ color: 'green', fontWeight: '800' }}>Available</span></Card.Text> :
                                                <Card.Text>Current Status: <span style={{ color: 'red', fontWeight: '800' }}>Booked</span></Card.Text>
                                        }
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))
                    ) : (
                        <p>No cars added yet. 🥲🥲</p>
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
