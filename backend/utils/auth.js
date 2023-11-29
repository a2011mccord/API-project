const jwt = require('jsonwebtoken');
const { jwtConfig } = require('../config');
const { User, Spot, Review, Booking, SpotImage, ReviewImage } = require('../db/models');

const { secret, expiresIn } = jwtConfig;

// Sends a JWT Cookie
const setTokenCookie = (res, user) => {
  // Create the token.
  const safeUser = {
    id: user.id,
    email: user.email,
    username: user.username,
  };
  const token = jwt.sign(
    { data: safeUser },
    secret,
    { expiresIn: parseInt(expiresIn) } // 604,800 seconds = 1 week
  );

  const isProduction = process.env.NODE_ENV === "production";

  // Set the token cookie
  res.cookie('token', token, {
    maxAge: expiresIn * 1000, // maxAge in milliseconds
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction && "Lax"
  });

  return token;
};

const restoreUser = (req, res, next) => {
  // token parsed from cookies
  const { token } = req.cookies;
  req.user = null;

  return jwt.verify(token, secret, null, async (err, jwtPayload) => {
    if (err) {
      return next();
    }

    try {
      const { id } = jwtPayload.data;
      req.user = await User.findByPk(id, {
        attributes: {
          include: ['email', 'createdAt', 'updatedAt']
        }
      });
    } catch (e) {
      res.clearCookie('token');
      return next();
    }

    if (!req.user) res.clearCookie('token');

    return next();
  });
};

const requireAuth = [
  restoreUser,
  function (req, _res, next) {
    if (req.user) return next();

    const err = new Error('Authentication required');
    err.title = 'Authentication required';
    err.errors = { message: 'Authentication required' };
    err.status = 401;
    return next(err);
  }
];

const authorize = async function (req, res, next) {
  const { spotId, reviewId, bookingId } = req.params;
  const spot = await Spot.findByPk(spotId);
  const review = await Review.findByPk(reviewId);
  const booking = await Booking.findByPk(bookingId);
  if (!spot && !reviewId && !bookingId) {
    res.status(404);
    return res.json({ "message": "Spot couldn't be found" });
  } else if (!review && !spotId && !bookingId) {
    res.status(404);
    return res.json({ "message": "Review couldn't be found" });
  } else if (!booking && !spotId && !reviewId) {
    res.status(404);
    return res.json({ "message": "Booking couldn't be found" });
  };

  const userId = req.user.id;
  let permission = false;
  if (spotId) {
    if (userId === spot.ownerId) {
      permission = true;
    };
  } else if (reviewId) {

    if (userId === review.userId) {
      permission = true;
    };
  } else if (bookingId) {
    if (userId === booking.userId) {
      permission = true;
    } else if (req.method === 'DELETE') {
      return next();
    };
  };

  if (permission) return next();
  else {
    const err = new Error('Forbidden');
    err.title = 'Authorization required';
    err.errors = { message: 'Authorization required' };
    err.status = 403;
    return next(err);
  }
};

const notOwner = async function (req, res, next) {
  const userId = req.user.id;
  const  spotId  = req.params.spotId;
  const spot = await Spot.findByPk(spotId);
  if (!spot) {
    res.status(404)
    return res.json({ "message": "Spot couldn't be found" });
  };

  if (userId !== spot.ownerId) return next();
  else {
    const err = new Error('Forbidden');
    err.title = 'Authorization required';
    err.errors = { message: 'Authorization required' };
    err.status = 403;
    return next(err);
  }
};

const owner = async (req, res, next) => {
  const { user } = req;
  const { bookingId, imageId } = req.params;
  if (bookingId) {
    const booking = await Booking.findByPk(bookingId);
    const spot = await Spot.findByPk(booking.spotId);

    if (user.id === spot.ownerId) return next();
    else if (user.id === booking.userId) return next();

  } else if (imageId) {
    const spotImage = await SpotImage.findByPk(imageId);
    if (!spotImage) {
      res.status(404);
      return res.json({ "message": "Spot Image couldn't be found" })
    };
    const spot = await Spot.findByPk(spotImage.spotId);

    if (!spot || user.id === spot.ownerId) return next();
  }


  const err = new Error('Forbidden');
  err.title = 'Authorization required';
  err.errors = { message: 'Authorization required' };
  err.status = 403;
  return next(err);
};

const reviewOwner = async (req, res, next) => {
  const { user } = req;
  const { imageId } = req.params;

  const reviewImage = await ReviewImage.findByPk(imageId);
  if (!reviewImage) {
    res.status(404);
    return res.json({ "message": "Review Image couldn't be found" })
  };
  const review = await Review.findByPk(reviewImage.reviewId);

  if (!review || user.id === review.userId) return next()
  else {
    const err = new Error('Forbidden');
    err.title = 'Authorization required';
    err.errors = { message: 'Authorization required' };
    err.status = 403;
    return next(err);
  };
};

module.exports = { setTokenCookie, restoreUser, requireAuth, authorize, notOwner, owner, reviewOwner };
