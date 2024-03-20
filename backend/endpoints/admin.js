const express = require("express");
const router = express.Router();

const Admin = require("../models/admin");
const Customer = require("../models/customer");
const Car = require("../models/cars");

const s3 = require("../middleware/s3");

const {carImageUpload } = require("../multer");


router.post("/add-car/:brand/:model",carImageUpload,  async (req, res) => {
    try {
        const {brand,model,year,color,price,stock,description} = req.body
        const response = await s3.uploadFile("bookimages",req.files.carImage[0]) ; 
        const car = new Car({
            brand,
            model,
            year,
            color,
            price,
            stock,
            description,
            image:response.Location
        });
        await car.save();
        return res.status(201).json(car);
    } catch (error) {
        console.log(error)
        return res.status(400).json({ message: error.message });
    }
});

router.get(("/get-cars"), async (req, res) => {
    try {
        const cars = await Car.find();
        return res.status(200).json(cars);
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: error.message });
    }
})

module.exports = router;