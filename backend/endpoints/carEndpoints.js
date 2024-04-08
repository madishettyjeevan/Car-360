const express = require("express");
const router = express.Router();
const Car = require("../models/Cars");
const Booking = require("../models/Bookings");

const s3 = require("../middleware/s3");

const {carImageUpload } = require("../multer");
const { default: mongoose } = require("mongoose");


router.post("/add-car/:userId", carImageUpload,  async (req, res) => {
    try {
        const {brand,model,year,color,price,description} = req.body;
        const userId = req.params.userId;
        const response = await s3.uploadFile("bookimages",req.files.carImage[0]) ; 
        const car = new Car({
            brand,
            model,
            year,
            color,
            price,
            description,
            imageUrl:response.Location,
            owner:userId
        });
        await car.save();
        return res.status(200).json({message:"successfull"});
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong..."});
    }
});