const express=require("express"); // importing the express framework
const app=express();

// Load environment variables, configure CORS, and connect to MongoDB Atlas cluster.
const dotenv = require("dotenv");
dotenv.config({ path: __dirname+'/.env' });
console.log(process.env.AWS_BUCKET_NAME);

const mongoose = require("mongoose");
const cors=require("cors");
app.use(cors());

mongoose.connect("mongodb+srv://user:1234567890@cluster0.gla6bka.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db=mongoose.connection;
db.on("error",(error)=> console.log(error));
db.once("open",()=>console.log("connected to database"));




app.use(express.json());
app.use(express.urlencoded({ 
    extended: true 
}));

const authRoutes = require("./endpoints/authEndpoints");
app.use("/auth", authRoutes);

// const adminRoutes = require("./endpoints/admin");
// app.use("/admin", adminRoutes);


app.all("/*",(req,res)=>{
    return res.status(404).json({message:"Page not found"});
});

//port listening at in the server
app.listen(3002, ()=>{
    console.log("running on port " + 3001);
});
