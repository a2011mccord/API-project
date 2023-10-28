const express = require('express');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { Op } = require('sequelize');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Spot, SpotImage, Review, User } = require('../../db/models');

const router = express.Router();

router.get('/:spotId', async (req, res, next) => {
  const spotId = req.params.spotId;
  let spot = await Spot.findByPk(spotId, {
    include: [
      {
        model: Review
      },
      {
        model: SpotImage,
        attributes: [ "id", "url", "preview" ]
      },
      {
        model: User,
        attributes: [ "id", "firstName", "lastName" ],
        as: "Owner"
      }
    ]
  });

  if (spot) {
    spot = spot.toJSON();
  } else {
    res.status(404);
    return res.json({ "message": "Spot couldn't be found" })
  }

  if (spot.Reviews.length) {
    spot.numReviews = spot.Reviews.length;

    let ratingsSum = 0;
    spot.Reviews.forEach(review => {
      ratingsSum += review.stars
    });
    spot.avgStarRating = ratingsSum / spot.Reviews.length;
  } else {
    spot.numReviews = 0
    spot.avgStarRating = "No reviews for this spot yet"
  };
  delete spot.Reviews;

  res.json(spot);
})

router.get('/current', async (req, res, next) => {
  const { user } = req;
  const spots = await Spot.findAll({
    where: { ownerId: user.id },
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
    };
    delete spot.Reviews;
  });

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
    };
    delete spot.Reviews;
  });

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
