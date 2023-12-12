const User = require('../models/user');
const { body, validationResult } = require('express-validator');
const asyncHandler = require('express-async-handler');

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
    .withMessage('This is not a valid email address'),
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
  body('password2'),
  // custom validators
  body('email').custom(async (value, { req, res, next }) => {
    const user = await User.find({ email: value });
    if (user) res.render('sign_up', { errors: ['E-mail is already in use'] });
  }),
  body('password2').custom(async (value, { req, res, next }) => {
    const firstPassword = req.body.password;
    if (firstPassword !== value)
      res.render('sign_up', { errors: ['Passwords are not the same'] });
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
    }
    res.redirect(`/`, { title: 'Main Page' });
  }),
];
