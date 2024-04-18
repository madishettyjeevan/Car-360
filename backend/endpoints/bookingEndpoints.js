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
router.get("/get-cars/only/:userId", async (req, res) => {
    try {
        const userId = req.params.userId;
        const carDetails = [];
        const cars = await Car.find({ owner: new mongoose.Types.ObjectId(userId) });
        for(const element of cars){
            let details = {
                brand: element.brand,
                description: element.description,
                imageUrl: element.imageUrl,
                price: element.price,
                color: element.color,
                year: element.year,
                model: element.model,
                currentlyBooked: element.currentlyBooked
            };
            if(element.currentlyBooked){
                const bookingDetails = await Booking.findOne({car: element._id, bookingActive: true}).populate('user');
                details = {
                    ...details,
                    bookedBy: bookingDetails.user.username,
                    bookingStart: bookingDetails.startDate,
                    bookingEnd: bookingDetails.endDate,
                    totalPrice: bookingDetails.totalPrice
                }
            }
            carDetails.push(details);
        }
        return res.status(200).json(carDetails);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong..."});
    }
});

router.post("/renew/:userId/:carId", async(req, res) => {
    try{
        const { userId, carId } = req.params;
        const { hours } = req.body;

        if(!userId || !carId || !hours){
            return res.status(400).json({message:"Data is invalid"});
        }

        const bookingToBeRenewed = await Booking.findOne({bookingActive: true, car: new mongoose.Types.ObjectId(carId), user: new mongoose.Types.ObjectId(userId)});
        if(bookingToBeRenewed === null){
            return res.status(400).json({message:"Sorry, Car is not available"});
        }

        const { username, email } = await User.findOne({_id: new mongoose.Types.ObjectId(userId)}, {_id:0});
        const { price, brand, model } = await Car.findOne({_id:new mongoose.Types.ObjectId(carId)},{_id:0});
        const startDate = new Date(bookingToBeRenewed.endDate);
        const endDate = new Date(startDate.getTime() + hours * 3600000 );
        const totalPrice = bookingToBeRenewed.totalPrice + price*hours;

        bookingToBeRenewed.endDate = endDate;
        bookingToBeRenewed.totalPrice = totalPrice;
        bookingToBeRenewed.bookingTBENotification = false;

        await sendEmail(
            username,
            email,
            'Car Booking Renewel',
            `\n\nYour booking for car ${brand} ${model} has been renewed. New End time is ${endDate.toLocaleString()}`
        )
        await bookingToBeRenewed.save();
        res.status(200).json({message: "Booking has been renewed successfully"});
    }catch(error){
        console.log(error);
        res.status(500).json({ message: "Something went wrong..."});
    }
});


