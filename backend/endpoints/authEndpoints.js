const express = require("express");
const router = express.Router();

const User = require("../models/Users");


router.post("/register-user", async(req, res) => {
    try{
        const {email, password, username} = req.body;
        if(!email || !username || !password){
            return res.status(400).json({message: "Please key in all the required details"});
        }
        const isEmailExist = await User.findOne({email:email});
        if(isEmailExist){
            return res.status(400).json({message:"Email already exists"});
        }
        if(password.length < 5){
            return res.status(400).json({message:"Password must be at least 6 characters long"});
        }
        const newUser = new User({
            email: email,
            password: password,
            username
        })
        await newUser.save();
        return res.status(200).json({message:"User registered successfully"});
    }catch(error){
        console.log(error);
        return res.status(500).json({message:"Internal server error"});
    }
});
router.post("/login-user", async(req, res) => {
    try{
        const {email, password} = req.body;
        const existingUser = await User.findOne({email:email}).lean();
        if(!existingUser){
            return res.status(400).json({message:"Email not found"});
        }
        if(password !== existingUser.password){
            return res.status(400).json({message:"Password is incorrect"});
        }
        return res.status(200).json({message:"User logged in successfully",user:existingUser});
    }catch(error){
        console.log(error);
        return res.status(500).json({message:"Internal server error"});
    }
});

//Exporting the router object to make defined routes accessible in other modules

module.exports = router;
