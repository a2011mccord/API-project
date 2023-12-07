const express = require('express');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { Op } = require('sequelize');

const { requireAuth, authorize } = require('../../utils/auth');
const { Spot, SpotImage, Review, User, ReviewImage } = require('../../db/models');

const router = express.Router();

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
]

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

    review.Spot.lat = Number(review.Spot.lat);
    review.Spot.lng = Number(review.Spot.lng);
    review.Spot.price = Number(review.Spot.price);
  });

  const response = {
    "Reviews": reviewsList
  }
  res.json(response);
});

router.post('/:reviewId/images', requireAuth, authorize, async (req, res, next) => {
  const review = await Review.findByPk(req.params.reviewId, { include: { model: ReviewImage }});
  if (!review) {
    res.status(404);
    return res.json({ "message": "Review couldn't be found" })
  };
  const imageInfo = req.body;
  imageInfo.reviewId = review.id;

  if (review.ReviewImages.length < 10) {
    const image = await ReviewImage.create(imageInfo);
    await review.addReviewImage(image);

    const response = {
      "id": image.id,
      "url": image.url
    }
    res.json(response);
  } else {
    res.status(403);
    return res.json({ "message": "Maximum number of images for this resource was reached" })
  };
});

router.put('/:reviewId', requireAuth, authorize, validateReviewInfo, async (req, res, next) => {
  const review = await Review.findByPk(req.params.reviewId);
  const newReviewInfo = req.body;

  await review.set({
    review: newReviewInfo.review,
    stars: newReviewInfo.stars
  })

  await review.save();
  res.json(review);
});

router.delete('/:reviewId', requireAuth, authorize, async (req, res, next) => {
  const review = await Review.findByPk(req.params.reviewId);

  await review.destroy();

  res.json({ 'message': 'Successfully deleted' });
});

module.exports = router
