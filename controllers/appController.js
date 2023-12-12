const User = require('../models/user');
const { body, validationResult } = require('express-validator');
const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
// const passport = require('../passport-config');

exports.main_page = asyncHandler(async (req, res, next) => {
  res.render('index', { title: 'Main page' });
});

exports.sign_up_get = asyncHandler(async (req, res, next) => {
  res.render('sign_up', { errors: null });
});

exports.sign_up_post = [
  body('name')
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage('You have to write Your name'),
  body('secondName')
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage('You have to write Your second name')
    .escape(),
  body('email')
    .trim()
    .isEmail()
    .withMessage('This is not a valid email address')
    .custom(async (value, { req }) => {
      const user = await User.find({ email: value });
      console.log(user);
      if (user.email) {
        throw new Error('A user already exists with this e-mail address');
      }
      return true; // Validation successful
    }),
  body('password')
    .trim()
    .isLength({ min: 8 })
    .withMessage('Must contain at least 8 characters')
    .isLowercase()
    .withMessage('Password must contain at least one lowercase')
    .isUppercase()
    .withMessage('Password must contain at least one uppercase')
    .isNumeric()
    .withMessage('Password must contain at least one number')
    .escape(),
  body('password2').custom(async (value, { req }) => {
    const firstPassword = req.body.password;
    if (firstPassword !== value) {
      throw new Error('Passwords do not match');
    }
    return true; // Validation successful
  }),
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      // Handle validation errors
      // You may want to customize this based on your needs
      res.render('sign_up', {
        errors: errors.array(),
      });
      return;
    } else {
      try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const newUser = new User({
          name: req.body.name,
          secondName: req.body.secondName,
          email: req.body.email,
          password: hashedPassword,
        });

        await newUser.save();
        res.redirect('/');
      } catch (error) {
        res.render(error);
      }
    }
  }),
];
