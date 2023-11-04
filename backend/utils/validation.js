const { validationResult } = require('express-validator');
const { Booking } = require('../db/models');

const validateBooking = async (req, res, next) => {
  const bookingInfo = req.body;
  const bookings = await Booking.findAll({
    where: { spotId: req.params.spotId }
  });

  const newStartDate = new Date(bookingInfo.startDate);
  const newEndDate = new Date(bookingInfo.endDate);

  if (newStartDate.getTime() >= newEndDate.getTime()) {
    const err = new Error("Bad Request");
    err.errors = { "endDate": "endDate cannot be on or before startDate"}
    err.status = 400;
    next(err);
  }

  bookings.forEach(booking => {
    const oldStartDate = new Date(booking.startDate);
    const oldEndDate = new Date(booking.endDate)

    if (newStartDate.getTime() <= oldEndDate.getTime()) {
      const conflictErr = new Error("Sorry, this spot is already booked for the specified dates");
      conflictErr.errors = { "startDate": "Start date conflicts with an existing booking"};
      conflictErr.status = 403;
      next(conflictErr);
    } else if (newEndDate.getTime() >= oldStartDate.getTime()) {
      const conflictErr = new Error("Sorry, this spot is already booked for the specified dates");
      conflictErr.errors = { "endDate": "End date conflicts with an existing booking"};
      conflictErr.status = 403;
      next(conflictErr);
    } else {
      next();
    };
  })
}

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
