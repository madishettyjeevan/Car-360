const express = require("express");
const router = express.Router();

const Admin = require("../models/admin");
const Customer = require("../models/customer");

//// Route handler for handling POST requests to login an administrator

router.post("/register-admin", async(req, res) => {
    try{
        const {email, password,username} = req.body;
        const isEmailExist = await Admin.findOne({email:email});
        if(isEmailExist){
            return res.status(400).json({message:"Email already exists"});
        }
        if(password.length < 5){
            return res.status(400).json({message:"Password must be at least 6 characters long"});
        }
        const admin = new Admin({
            email: email,
            password: password,
            username
        })
        await admin.save();
        return res.status(200).json({message:"Admin registered successfully",user:admin});
    }catch(error){
        console.log(error);
        return res.status(500).json({message:"Internal server error"});
    }
});

router.post("/login-admin", async(req, res) => {
    try{
        const {email, password} = req.body;
        const admin = await Admin.findOne({email:email}).lean();
        if(!admin){
            return res.status(400).json({message:"Email not found"});
        }
        if(password !== admin.password){
            return res.status(400).json({message:"Password is incorrect"});
        }
        return res.status(200).json({message:"Admin logged in successfully",user:admin});
    }catch(error){
        console.log(error);
        return res.status(500).json({message:"Internal server error"});
    }
})

module.exports = router;
