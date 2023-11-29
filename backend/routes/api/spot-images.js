const express = require('express');
const { check } = require('express-validator');
const { handleValidationErrors, validateBooking } = require('../../utils/validation');
const { Op } = require('sequelize');

const { requireAuth, authorize, owner } = require('../../utils/auth');
const { Spot, SpotImage, Review, User, ReviewImage, Booking } = require('../../db/models');

const router = express.Router();

router.delete('/:imageId', requireAuth, owner, async (req, res, next) => {
  const spotImage = await SpotImage.findByPk(req.params.imageId);

  await spotImage.destroy();

  res.json({ 'message': 'Successfully deleted' });
})

module.exports = router;
