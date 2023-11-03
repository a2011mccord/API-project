const express = require('express');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { Op } = require('sequelize');

const { setTokenCookie, requireAuth, authorize } = require('../../utils/auth');
const { Spot, SpotImage, Review, User } = require('../../db/models');

const router = express.Router();

const validateSpotInfo = [
  check('address')
    .exists({ checkFalsy: true })
    .notEmpty()
    .withMessage('Street address is required'),
  check('city')
    .exists({ checkFalsy: true })
    .notEmpty()
    .withMessage('City is required'),
  check('state')
    .exists({ checkFalsy: true })
    .notEmpty()
    .withMessage('State is required'),
  check('country')
    .exists({ checkFalsy: true })
    .notEmpty()
    .withMessage('Country is required'),
  check('lat')
    .exists({ checkFalsy: true })
    .notEmpty()
    .isDecimal()
    .withMessage('Latitude is not valid'),
  check('lng')
    .exists({ checkFalsy: true })
    .notEmpty()
    .isDecimal()
    .withMessage('Longitude is not valid'),
  check('name')
    .exists({ checkFalsy: true })
    .notEmpty()
    .isLength({ max: 50 })
    .withMessage('Name must be less than 50 characters'),
  check('description')
    .exists({ checkFalsy: true })
    .notEmpty()
    .withMessage('Description is required'),
  check('price')
    .exists({ checkFalsy: true })
    .notEmpty()
    .isDecimal()
    .withMessage('Price per day is required'),
  handleValidationErrors
];

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

router.get('/current', requireAuth, async (req, res, next) => {
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

router.post('/:spotId/images', requireAuth, authorize, async (req, res, next) => {
  const spot = await Spot.findByPk(req.params.spotId);
  if (!spot) {
    res.status(404);
    return res.json({ "message": "Spot couldn't be found" })
  };
  const imageInfo = req.body;
  imageInfo.spotId = spot.id;
  const image = await SpotImage.create(imageInfo);

  await spot.addSpotImage(image);


  res.json({
    "id": image.id,
    "url": image.url,
    "preview": image.preview
  });
});

router.post('/', requireAuth, validateSpotInfo, async (req, res, next) => {
  const { user } = req;
  const spotInfo = req.body;
  spotInfo.ownerId = user.id;

  const newSpot = await Spot.create(spotInfo);

  res.status(201);
  res.json(newSpot);
});

router.put('/:spotId', requireAuth, authorize, validateSpotInfo, async (req, res, next) => {
  const spot = await Spot.findByPk(req.params.spotId);
  const newSpotInfo = req.body;

  await spot.set({
    address: newSpotInfo.address,
    city: newSpotInfo.city,
    state: newSpotInfo.state,
    country: newSpotInfo.country,
    lat: newSpotInfo.lat,
    lng: newSpotInfo.lng,
    name: newSpotInfo.name,
    description: newSpotInfo.description,
    price: newSpotInfo.price
  });

  await spot.save();
  res.json(spot);
});

router.delete('/:spotId', requireAuth, authorize, async (req, res, next) => {
  const spot = await Spot.findByPk(req.params.spotId);

  spot.destroy();

  res.json({ 'message': 'Successfully deleted' });
});

module.exports = router
