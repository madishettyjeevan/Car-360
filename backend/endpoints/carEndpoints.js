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

router.get("/get-cars/except/:userId", async (req, res) => {
    try {
        const userId = req.params.userId;
        const cars = await Car.aggregate([
            {
                $match: {
                    owner: { $ne: new mongoose.Types.ObjectId(userId) }
                }
            },
            {
                $lookup: {
                    from: 'bookings',
                    let: { car_id: '$_id' },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ['$car', '$$car_id'] },
                                        { $eq: ['$bookingActive', true] }
                                    ]
                                }
                            }
                        },
                        {
                            $project: { endDate: 1 }
                        }
                    ],
                    as: 'bookingDetails'
                }
            },
            {
                $unwind: {
                    path: '$bookingDetails',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $addFields: {
                    endDate: '$bookingDetails.endDate'
                }
            },
            {
                $project: {
                    bookingDetails: 0
                }
            }
            ]);
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

module.exports = router;