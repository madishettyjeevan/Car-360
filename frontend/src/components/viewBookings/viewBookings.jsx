import { useContext, useEffect, useState } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

import { UserContext } from '../../context/context';
import NavBar from '../Navbar/Navbar';
import PopUp from '../popup/popup';
import Loader from '../loader/loader';

import axios from '../../axios';

export default function ViewBookings() {

    const { userId, isLoggedIn } = useContext(UserContext)
    const navigate = useNavigate();

    const [activeBookings, setActiveBookings] = useState([]);
    const [expiredBookings, setExpiredBookings] = useState([]);
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

    const fetchbookings = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`/booking/bookings/${userId}`, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            setActiveBookings(response.data.filter(b => b.bookingActive === true))
            setExpiredBookings(response.data.filter(b => b.bookingActive === false))
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
            fetchbookings();
        }
        // eslint-disable-next-line
    }, []);

    return (
        <>
            <NavBar />

            <Container className="my-4 mx-auto  dashboard-container">
                <Row>
                    <h2 className='text-left main_text my-3'>Your Current Reservations ✔️✔️</h2>
                    <hr />
                    {activeBookings.length > 0 ? (
                        activeBookings.map((booking, index) => (
                            <Col xs={12} md={6} lg={4}>
                                <Card className="car-card my-3" key={index}>
                                    <Card.Img
                                        src={booking.car.imageUrl}
                                        alt={`${booking.car.brand} ${booking.car.model}`}
                                        className="car-image"
                                        style={{ height: "200px", objectFit: "cover" }}
                                    />
                                    <Card.Body>
                                        <Card.Title>{booking.car.brand} {booking.car.model}</Card.Title>
                                        <Card.Text>Booking Id : {booking._id}</Card.Text>
                                        <Card.Text>Booking Start: {new Date(booking.startDate).toLocaleString()}</Card.Text>
                                        <Card.Text>Booking End: {new Date(booking.endDate).toLocaleString()}</Card.Text>
                                        <Card.Text>Total cost: ${booking.totalPrice}</Card.Text>

                                    </Card.Body>
                                </Card>
                            </Col>
                        ))
                    ) : (
                        <p>Currently You have no active bookings. 😔🫤</p>
                    )}
                </Row>

                <Row>
                    <h2 className='text-left main_text my-3'>Trips Treasured 💛💖</h2>
                    <hr />
                    {expiredBookings.length > 0 ? (
                        expiredBookings.map((booking, index) => (
                            <Col xs={12} md={6} lg={4}>
                                <Card className="car-card my-3" key={index}>
                                    <Card.Img
                                        src={booking.car.imageUrl}
                                        alt={`${booking.car.brand} ${booking.car.model}`}
                                        className="car-image"
                                        style={{ height: "200px", objectFit: "cover" }}
                                    />
                                    <Card.Body>
                                        <Card.Title>{booking.car.brand} {booking.car.model}</Card.Title>
                                        <Card.Text>Booking Id : {booking._id}</Card.Text>
                                        <Card.Text>Booking Start: {new Date(booking.startDate).toLocaleString()}</Card.Text>
                                        <Card.Text>Booking End: {new Date(booking.endDate).toLocaleString()}</Card.Text>
                                        <Card.Text>Total cost: ${booking.totalPrice}</Card.Text>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))
                    ) : (
                        <p>Looks like you haven't made any bookings yet. Start exploring our selection of cars and plan your next adventure today! 🚀🚀</p>
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
