const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    carId: {
        type: String,
        required: true
    },
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer',
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    totalPrice: {
        type: Number,
        required: true
    }
})

module.exports = mongoose.model('Booking', bookingSchema);