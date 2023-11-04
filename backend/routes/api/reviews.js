const express = require('express');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { Op } = require('sequelize');

const { requireAuth, authorize } = require('../../utils/auth');
const { Spot, SpotImage, Review, User, ReviewImage } = require('../../db/models');

const router = express.Router();

router.get('/current', requireAuth, async (req, res, next) => {
  const { user } = req;
  const reviews = await Review.findAll({
    where: { userId: user.id },
    include: [
      {
        model: User,
        attributes: [ 'id', 'firstName', 'lastName' ]
      },
      {
        model: Spot,
        attributes: { exclude: [ 'description', 'createdAt', 'updatedAt' ]},
        include: { model: SpotImage }
      },
      {
        model: ReviewImage,
        attributes: { exclude: [ 'createdAt', 'updatedAt' ]}
      }
    ]
  });

  let reviewsList = [];
  reviews.forEach(review => {
    reviewsList.push(review.toJSON());
  })

  reviewsList.forEach(review => {
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
    "Reviews": reviewsList
  }
  res.json(response);
});

module.exports = router
