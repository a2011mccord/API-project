const express = require('express');
const { check } = require('express-validator');
const { handleValidationErrors, validateBooking } = require('../../utils/validation');
const { Op } = require('sequelize');

const { requireAuth, authorize } = require('../../utils/auth');
const { Spot, SpotImage, Review, User, ReviewImage, Booking } = require('../../db/models');

const router = express.Router();

router.get('/current', requireAuth, async (req, res, next) => {
  const { user } = req;
  const bookings = await Booking.findAll({
    where: { userId: user.id },
    include: [
      {
        model: Spot,
        attributes: { exclude: [ 'description', 'createdAt', 'updatedAt' ]},
        include: { model: SpotImage }
      }
    ]
  });

  let bookingsList = [];
  bookings.forEach(review => {
    bookingsList.push(review.toJSON());
  })

  bookingsList.forEach(review => {
    review.Spot.SpotImages.forEach(image => {
      if (image.preview === true) {
        review.Spot.previewImage = image.url
      };
    });
    if (!review.Spot.previewImage) {
      review.Spot.previewImage = "No preview image found"
    };
    delete review.Spot.SpotImages
  });

  const response = {
    "Bookings": bookingsList
  }
  res.json(response);
});

router.put('/:bookingId', requireAuth, authorize, validateBooking, async (req, res, next) => {
  const booking = await Booking.findByPk(req.params.bookingId);
  const newBookingInfo = req.body;

  await booking.set({
    startDate: newBookingInfo.startDate,
    endDate: newBookingInfo.endDate
  })

  await booking.save();
  res.json(booking);
});

module.exports = router;
