const cron = require('node-cron');

const sendEmail = require("./sendEmail");
const Booking = require("../models/Bookings");
const Cars = require('../models/Cars');
const { default: mongoose } = require('mongoose');

// 1) Cron job to send an email when someone books a car (runs every 10 minutes)
cron.schedule('*/1 * * * *', async () => {
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

// 2) Cron job to send an email when booked time hits 80% (runs every 15 minutes)
cron.schedule('*/2 * * * *', async () => {
  try {
    const currentTime = new Date();
    const bookings = await Booking.find({bookingActive: true, bookingTBENotification: false}).populate('car').populate('user');

    bookings.forEach( async(booking) => {
      const totalDuration = booking.endDate - booking.startDate;
      const eightyPercent = totalDuration * 0.8;

      if (currentTime - booking.startDate >= eightyPercent) {

        const emailResponse = await sendEmail(
          booking.user.username,
          booking.user.email,
          'Booking Reminder',
          `Dear ${booking.user.username},\n\nYour booking for car ${booking.car.brand} ${booking.car.model} will end soon.`
        )
        if(emailResponse){
          booking.bookingTBENotification = true;
          await booking.save();
        }
      }
        });
  } catch (error) {
    console.error('Error processing bookings:', error);
  }
});

// 3) Cron job to send an email when booking expires (runs every 5 minutes)
cron.schedule('*/3 * * * *', async () => {
  try {    
    const currentTime = new Date();
    const expiredBookings = await Booking.find({bookingActive: true, endDate: { $lt: currentTime }, bookingEndNotification: false }).populate('car').populate('user');
    expiredBookings.forEach( async(booking) => {

      const emailResponse = await sendEmail(
        booking.user.username,
        booking.user.email,
        'Booking Expired',
        `Dear ${booking.user.username},\n\nYour booking for car ${booking.car.brand} ${booking.car.model} has expired.`
      )
      if(emailResponse){
          booking.bookingEndNotification = true;
          booking.bookingActive = false;
          await booking.save();

          const car = await Cars.findOne({_id: new mongoose.Types.ObjectId(booking.car._id)});
          car.currentlyBooked = false;
          await car.save();
      }
    });
  } catch (error) {
    console.error('Error processing expired bookings:', error);
  }
});
