import "./index.css";

import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { UserContext } from "./context/context";

import Dashboard from "./components/dashboard/dashboard";
import AddCar from "./components/addCar/addCar";
import ViewListings from "./components/viewListings/viewListings";
import ViewBookings from "./components/viewBookings/viewBookings";
import ViewAvailable from "./components/viewAvailable/viewAvailable";
import Payment from "./components/payment/payment";
import BookCar from "./components/bookCar/bookCar";
import Login from "./components/login/login";
import Signup from "./components/signup/signup";

export default function App() {
  const [user, setUser] = useState({});

  const [carToBeBooked, setCarToBeBooked] = useState({});
  const [bookingData, setBookingData ] = useState({});

  return (
    <BrowserRouter>
      <UserContext.Provider value={user}>
        <Routes>
          <Route path="/" element={<Login setUser={setUser} />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/add-car" element={<AddCar />} />
          <Route path="/view-listings" element={<ViewListings/>} />
          <Route path="/view-bookings" element={<ViewBookings/>} />
          <Route path="/view-available" element={<ViewAvailable setCarToBeBooked={setCarToBeBooked}/>} />
          <Route path="/view-available/:carId" element={<BookCar setBookingData={setBookingData} carToBeBooked={carToBeBooked}/>} />
          <Route path="/book-car/payment/:carId" element={<Payment bookingData={bookingData}/>} />
        </Routes>
      </UserContext.Provider>
    </BrowserRouter>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
