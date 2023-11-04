const { validationResult } = require('express-validator');
const { Booking } = require('../db/models');

const validateBooking = async (req, res, next) => {
  const bookingInfo = req.body;
  const { spotId, bookingId } = req.params;
  let bookings;
  if (spotId) {
    bookings = await Booking.findAll({
      where: { spotId: spotId }
    });
  } else if (bookingId) {
    bookings = await Booking.findAll({
      where: { id: bookingId }
    });
  };


  const currentDate = new Date();

  if (req.method === 'DELETE') {
    const startDate = new Date(booking.startDate);
    const endDate = new Date(booking.endDate);
    if (startDate.getTime() <= currentDate.getTime() && endDate.getTime() >= currentDate.getTime()) {
      const err = new Error("Bookings that have been started can't be deleted");
      err.status = 413;
      next(err);
    }
  }

  const newStartDate = new Date(bookingInfo.startDate);
  const newEndDate = new Date(bookingInfo.endDate);

  if (newStartDate.getTime() >= newEndDate.getTime()) {
    const err = new Error("Bad Request");
    err.errors = { "endDate": "endDate cannot be on or before startDate" }
    err.status = 400;
    next(err);
  }

  bookings.forEach(booking => {
    const oldStartDate = new Date(booking.startDate);
    const oldEndDate = new Date(booking.endDate);

    if (newStartDate.getTime() <= oldEndDate.getTime() && newEndDate.getTime() >= oldStartDate.getTime()) {
      const conflictErr = new Error("Sorry, this spot is already booked for the specified dates");
      conflictErr.errors = { "startDate": "Start date conflicts with an existing booking"};
      conflictErr.status = 403;
      next(conflictErr);
    } else if (newEndDate.getTime() >= oldStartDate.getTime() && newStartDate.getTime() <= oldEndDate.getTime()) {
      const conflictErr = new Error("Sorry, this spot is already booked for the specified dates");
      conflictErr.errors = { "endDate": "End date conflicts with an existing booking"};
      conflictErr.status = 403;
      next(conflictErr);
    } else if (bookingId && oldStartDate.getTime() <= currentDate.getTime()) {
      const err = new Error("Past bookings can't be modified");
      err.status = 413;
      next(err);
    } else {
      next();
    };
  });
};

// middleware for formatting errors from express-validator middleware
// (to customize, see express-validator's documentation)
const handleValidationErrors = (req, _res, next) => {
  const validationErrors = validationResult(req);

  if (!validationErrors.isEmpty()) {
    const errors = {};
    validationErrors
      .array()
      .forEach(error => errors[error.path] = error.msg);

    const err = Error("Bad request.");
    err.errors = errors;
    err.status = 400;
    err.title = "Bad request.";
    next(err);
  }
  next();
};

module.exports = {
  handleValidationErrors,
  validateBooking
};
