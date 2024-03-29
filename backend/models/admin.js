const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        min: 6,
        max: 255
    },
    password: {
        type: String,
        required: true,
        min: 6,
        max: 1024
    },
    email: {
        type: String,
        required: true,
        min: 6,
        max: 255
    },
})
// Defines and exports a Mongoose model for 'Admin', utilizing the structure provided by 'adminSchema'. This enables CRUD operations on documents within the 'Admin' collection of the MongoDB database.
module.exports = mongoose.model("Admin", adminSchema);
