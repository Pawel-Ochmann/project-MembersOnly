const User = require('../models/user');
const { body, validatorResult } = require('express-validator');
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
    .withMessage('You have to write Your second name'),
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      // Handle validation errors
      // You may want to customize this based on your needs
      res.render('/sing-up', {
        errors: errors.array(),
      });
      return;
    }
    res.redirect(`/`, { title: 'Main Page' });
  }),
];
