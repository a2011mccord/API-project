const express = require('express');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { Op } = require('sequelize');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Spot, SpotImage, Review } = require('../../db/models');

const router = express.Router();

router.get('/', async (req, res, next) => {
  const spots = await Spot.findAll({
    include: [
      {
        model: SpotImage
      },
      {
        model: Review
      }
    ]
  });

  let spotsList = []
  spots.forEach(spot => {
    spotsList.push(spot.toJSON())
  });

  spotsList.forEach(spot => {
    let ratingsSum = 0;
    spot.Reviews.forEach(review => {
      ratingsSum += review.stars
    });
    if (ratingsSum) {
      spot.avgRating = ratingsSum / spot.Reviews.length;
    } else {
      spot.avgRating = "No reviews for this spot yet"
    }
    delete spot.Reviews;
  })

  spotsList.forEach(spot => {
    spot.SpotImages.forEach(image => {
      if (image.preview === true) {
        spot.previewImage = image.url
      };
    });
    if (!spot.previewImage) {
      spot.previewImage = "No preview image found"
    };
    delete spot.SpotImages
  });

  res.json(spotsList);
});

module.exports = router
