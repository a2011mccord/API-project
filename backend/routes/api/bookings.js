const express = require('express');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { Op } = require('sequelize');

const { requireAuth, authorize, owner } = require('../../utils/auth');
const { Spot, SpotImage, Review, User, ReviewImage, Booking } = require('../../db/models');

const router = express.Router();

const validateBookingInfo = [
  check('startDate')
    .exists({ checkFalsy: true })
    .notEmpty()
    .custom(value => {
      const today = new Date();
      const startDate = new Date(value);
      if (startDate < today) {
        throw new Error('start date cannot be in the past')
      }
      return true;
    }),
  check('endDate')
    .exists({ checkFalsy: true })
    .notEmpty()
    .custom((value, { req }) => {
      const startDate = new Date(req.body.startDate);
      const endDate = new Date(value);
      if (endDate <= startDate) {
        throw new Error('end date cannot be on or before start date');
      }
      return true;
    }),
  handleValidationErrors
];

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

router.put('/:bookingId', requireAuth, authorize, validateBookingInfo, async (req, res, next) => {
  const booking = await Booking.findByPk(req.params.bookingId);
  const newBookingInfo = req.body;

  // Past bookings can't be modified
  const today = new Date();
  const newEndDate = new Date(newBookingInfo.endDate);
  if (newEndDate <= today) {
    const err = new Error("Past bookings can't be modified");
    err.status = 403;
    throw err;
  };

  // Booking conflict validation
  const bookings = await Booking.findAll({
    where: { spotId: booking.spotId }
  });
  const newStartDate = new Date(newBookingInfo.startDate);
  bookings.forEach(currBooking => {
    const oldStartDate = new Date(currBooking.startDate);
    const oldEndDate = new Date(currBooking.endDate);

    const conflictErr = new Error("Sorry, this spot is already booked for the specified dates");
    conflictErr.errors = {};
    conflictErr.status = 403;

    if (currBooking.id !== booking.id) {
      if (newStartDate >= oldStartDate && newStartDate <= oldEndDate) {
        conflictErr.errors.startDate = "Start date conflicts with an existing booking";
      };
      if (newEndDate >= oldStartDate && newEndDate <= oldEndDate) {
        conflictErr.errors.endDate = "End date conflicts with an existing booking";
      };
      if (newStartDate < oldStartDate && newEndDate > oldEndDate) {
        conflictErr.errors.startDate = "Start date conflicts with an existing booking";
        conflictErr.errors.endDate = "End date conflicts with an existing booking";
      };
    };

    if (conflictErr.errors.startDate || conflictErr.errors.endDate) {
      throw conflictErr;
    };
  });

  await booking.set({
    startDate: newBookingInfo.startDate,
    endDate: newBookingInfo.endDate
  });
  await booking.save();

  res.json(booking);
});

router.delete('/:bookingId', requireAuth, authorize, owner, async (req, res, next) => {
  const booking = await Booking.findByPk(req.params.bookingId);

  // Can't delete bookings that have been started
  const today = new Date();
  const startDate = new Date(booking.startDate);
  if (startDate <= today) {
    const err = new Error("Bookings that have been started can't be deleted");
    err.status = 403;
    throw err;
  };

  await booking.destroy();

  res.json({ 'message': 'Successfully deleted' });
});

module.exports = router;
