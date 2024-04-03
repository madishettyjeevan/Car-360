const express = require("express");
const router = express.Router();
const { default: mongoose } = require("mongoose");

const Booking = require("../models/Bookings");
const Car = require("../models/cars");

router.post("/book/:userId/:carId", async(req, res)=>{
    try{
        const { userId, carId } = req.params;
        const { hours } = req.body;

        console.log(hours);

        if(!userId || !carId || !hours){
            return res.status(400).json({message:"Data is invalid"});
        }

        const carToBeBooked = await Car.findOne({_id: new mongoose.Types.ObjectId(carId)});
        if(carToBeBooked === null || carToBeBooked.currentlyBooked){
            return res.status(400).json({message:"Sorry, Car is not available"});
        }

        const startDate = new Date();
        const endDate = new Date(new Date().getTime() + hours * 3600000 );

        const totalTime = new Date(endDate) - new Date(startDate);
        if(totalTime/3600000 != hours){
            console.log("something is wrong");
        }
        const newBooking = new Booking({
            car:carId,
            user:userId,
            startDate,
            endDate,
            totalPrice: hours * carToBeBooked.price
        });
        await newBooking.save();

        carToBeBooked.currentlyBooked = true;
        await carToBeBooked.save();

        res.status(200).json({message: "Car has been booked successfully"});
    }catch(error){
        console.log(error);
        res.status(500).json({ message: "Something went wrong..."});
    }
});

router.get("/get-cars/except/:userId", async (req, res) => {
    try {
        const userId = req.params.userId;
        const cars = await Car.find({owner: {$ne: new mongoose.Types.ObjectId(userId)}, currentlyBooked:false});
        return res.status(200).json(cars);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong..."});
    }
});

