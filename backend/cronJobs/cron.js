const cron = require('node-cron');

const sendEmail = require("./sendEmail");
const Booking = require("../models/Bookings");
const Cars = require('../models/Cars');
const { default: mongoose } = require('mongoose');

// 1) Cron job to send an email when someone books a car (runs every 10 minutes)
cron.schedule('*/10 * * * *', async () => {
  try {
    const bookings = await Booking.find({bookingActive: true, bookingStartNotification: false}).populate('car').populate('user');
    bookings.forEach(async(booking) => {
      const emailResponse = await sendEmail(
        booking.user.username,
        booking.user.email,
        'Car Booking Confirmation',
        `Dear ${booking.user.username},\n\nYour booking for car ${booking.car.brand} ${booking.car.model} has been confirmed.`
      )
      if(emailResponse){
          booking.bookingStartNotification = true;
          await booking.save();
      }
    });
  } catch (error) {
    console.error('Error processing bookings:', error);
  }
});