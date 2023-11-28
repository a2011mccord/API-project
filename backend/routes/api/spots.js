const express = require('express');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { Op } = require('sequelize');

const { requireAuth, authorize, notOwner } = require('../../utils/auth');
const { Spot, SpotImage, Review, ReviewImage, User, Booking } = require('../../db/models');

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
const validateReviewInfo = [
  check('review')
    .exists({ checkFalsy: true })
    .notEmpty()
    .withMessage('Review text is required'),
  check('stars')
    .exists({ checkFalsy: true })
    .notEmpty()
    .isInt({ min: 1, max: 5 })
    .withMessage('Stars must be an integer from 1 to 5'),
  handleValidationErrors
];
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

router.get('/:spotId/bookings', requireAuth, async (req, res, next) => {
  const spot = await Spot.findByPk(req.params.spotId);
  if (!spot) {
    res.status(404)
    return res.json({ "message": "Spot couldn't be found" });
  };
  const { user } = req;
  const bookings = await Booking.findAll({
    where: { spotId: req.params.spotId },
    include: [{ model: User, attributes: ['id', 'firstName', 'lastName'] }]
  });

  let response;
  if (spot.ownerId === user.id) {
    response = {
      "Bookings": bookings
    }
  } else {
    const bookingsJson = [];
    bookings.forEach(booking => {
      bookingsJson.push(booking.toJSON());
    });
    const bookingsList = [];
    bookingsJson.forEach(booking => {
      bookingsList.push({
        "spotId": booking.spotId,
        "startDate": booking.startDate,
        "endDate": booking.endDate
      });
    });

    response = {
      "Bookings": bookingsList
    };
  };

  res.json(response);
});

router.get('/:spotId/reviews', async (req, res, next) => {
  const spotId = req.params.spotId;
  const spot = await Spot.findByPk(spotId);
  if (!spot) {
    res.status(404)
    return res.json({ "message": "Spot couldn't be found" });
  };

  const reviews = await Review.findAll({
    where: { spotId: spotId },
    include: [
      {
        model: User,
        attributes: [ 'id', 'firstName', 'lastName' ]
      },
      {
        model: ReviewImage,
        attributes: [ 'id', 'url' ]
      }
    ]
  });


  const response = {
    "Reviews": reviews
  }
  res.json(response);
});

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

router.post('/:spotId/bookings', requireAuth, notOwner, validateBookingInfo, async (req, res, next) => {
  const { user } = req;
  const spot = await Spot.findByPk(req.params.spotId);
  if (!spot) {
    res.status(404)
    return res.json({ "message": "Spot couldn't be found" });
  };

  const bookingInfo = req.body;
  bookingInfo.userId = user.id;
  bookingInfo.spotId = spot.id;

  // Booking conflict validation
  const bookings = await Booking.findAll({
    where: { spotId: spot.id }
  });
  const startDate = new Date(bookingInfo.startDate);
  const endDate = new Date(bookingInfo.endDate);
  bookings.forEach(booking => {
    const oldStartDate = new Date(booking.startDate);
    const oldEndDate = new Date(booking.endDate);

    const conflictErr = new Error("Sorry, this spot is already booked for the specified dates");
    conflictErr.errors = {};
    conflictErr.status = 403

    if (startDate >= oldStartDate && startDate <= oldEndDate) {
      conflictErr.errors.startDate = "Start date conflicts with an existing booking";
    };
    if (endDate >= oldStartDate && endDate <= oldEndDate) {
      conflictErr.errors.endDate = "End date conflicts with an existing booking";
    };

    if (conflictErr.errors.startDate || conflictErr.errors.endDate) {
      throw conflictErr;
    }
  });

  const newBooking = await Booking.create(bookingInfo);

  await spot.addBooking(newBooking);

  res.json(newBooking);
});

router.post('/:spotId/reviews', requireAuth, validateReviewInfo, async (req, res, next) => {
  const { user } = req;
  const spot = await Spot.findByPk(req.params.spotId);
  if (!spot) {
    res.status(404)
    return res.json({ "message": "Spot couldn't be found" });
  };
  const userReview = await Review.findAll({
    where: { [Op.and]: [{spotId: spot.id}, {userId: user.id}] }
  });
  if (userReview.length) {
    res.status(500);
    return res.json({ "message": "User already has a review for this spot" })
  }

  const reviewInfo = req.body;
  reviewInfo.userId = user.id;
  reviewInfo.spotId = spot.id;

  const newReview = await Review.create(reviewInfo);

  await spot.addReview(newReview);

  res.status(201);
  res.json(newReview);
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
