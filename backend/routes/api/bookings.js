const express = require('express');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { Op } = require('sequelize');

const { requireAuth, authorize } = require('../../utils/auth');
const { Spot, SpotImage, Review, User, ReviewImage, Booking } = require('../../db/models');

const router = express.Router();

router.get('/current', requireAuth, async (req, res, next) => {

});

module.exports = router;
