const express=require("express");
const app=express();

const dotenv = require("dotenv");
dotenv.config({ path: __dirname +'/.env' });

const mongoose = require("mongoose");
const cors=require("cors");
app.use(cors());

mongoose.connect( process.env.MONGODB_CONN_STRING, {
    useNewUrlParser: true,
});

const db=mongoose.connection;
db.on("error",(error)=> console.log(error));
db.once("open",()=>console.log("connected to database"));

require("./cronJobs/cron");

app.use(express.json());
app.use(express.urlencoded({ 
    extended: true 
}));

const authRoutes = require("./endpoints/authEndpoints");
app.use("/auth", authRoutes);

const bookingRoutes = require("./endpoints/bookingEndpoints");
app.use("/booking", bookingRoutes);

const carRoutes = require("./endpoints/carEndpoints");
app.use("/car", carRoutes);

app.all("/*",(req,res)=>{
    return res.status(404).json({message:"Page not found"});
});

//port listening at in the server
app.listen(3002, ()=>{
    console.log("running on port 3002");
});
