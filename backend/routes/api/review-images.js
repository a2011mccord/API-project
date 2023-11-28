const express = require('express');
const { check } = require('express-validator');
const { handleValidationErrors, validateBooking } = require('../../utils/validation');
const { Op } = require('sequelize');

const { requireAuth, authorize, owner, reviewOwner } = require('../../utils/auth');
const { Spot, SpotImage, Review, User, ReviewImage, Booking } = require('../../db/models');

const router = express.Router();

router.delete('/:imageId', requireAuth, reviewOwner, async (req, res, next) => {
  const reviewImage = await ReviewImage.findByPk(req.params.imageId);

  await reviewImage.destroy();

  res.json({ 'message': 'Successfully deleted' });
})

module.exports = router;
