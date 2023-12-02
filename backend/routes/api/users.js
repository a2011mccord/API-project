const express = require('express');
const bcrypt = require('bcryptjs');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User } = require('../../db/models');

const router = express.Router();

const validateSignup = [
  check('email')
    .exists({ checkFalsy: true })
    .isEmail()
    .withMessage('Invalid email'),
  check('username')
    .exists({ checkFalsy: true })
    .isLength({ min: 4 })
    .withMessage('Username is required'),
  check('username')
    .not()
    .isEmail()
    .withMessage('Username cannot be an email'),
  check('firstName')
    .exists({ checkFalsy: true })
    .notEmpty()
    .withMessage('First Name is required'),
  check('lastName')
    .exists({ checkFalsy: true })
    .notEmpty()
    .withMessage('Last Name is required'),
  check('password')
    .exists({ checkFalsy: true })
    .isLength({ min: 6 })
    .withMessage('Password must be 6 characters or more'),
  handleValidationErrors
];

// Sign up
router.post(
  '/',
  validateSignup,
  async (req, res, next) => {
    const { email, password, username, firstName, lastName } = req.body;
    const hashedPassword = bcrypt.hashSync(password);

    const existingUsers = await User.findAll({
      attributes: [ 'username', 'email' ]
    });
    existingUsers.forEach(user => {
      const err = new Error('User already exists');
      err.errors = {};

      if (user.email === email) {
        err.errors.email = "User with that email already exists";
      };
      if (user.username === username) {
        err.errors.username = "User with that username already exists";
      };

      if (Object.keys(err.errors).length) {
        next(err);
      };
    })

    const user = await User.create({ email, username, firstName, lastName, hashedPassword });

    const safeUser = {
      id: user.id,
      email: user.email,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName
    };

    await setTokenCookie(res, safeUser);

    return res.json({
      user: safeUser
    });
  }
);

module.exports = router;
