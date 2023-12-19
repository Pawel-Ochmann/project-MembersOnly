const User = require('../models/user');
const Message = require('../models/message');
const { body, validationResult } = require('express-validator');
const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const passport = require('../passport-config');

exports.main_page = asyncHandler(async (req, res, next) => {
  const messages = await Message.find().populate('author');

  res.render('index', { title: 'Main page', user: req.user, messages });
});

exports.sign_up_get = asyncHandler(async (req, res, next) => {
  res.render('sign_up', { errors: null, user: req.user });
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
        user: req.user,
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
        res.send(error);
      }
    }
  }),
];

exports.sign_in_get = asyncHandler(async (req, res, next) => {
  res.render('sign_in', { errors: null, user: req.user });
});

exports.sign_in_post = function (req, res, next) {
  passport.authenticate('local', (err, user, info) => {
    if (err) return res.render('sign_in', { errors: [err.message], user: req.user });
    else if (!user) {
      // Authentication failed, render sign-in page with error message
      return res.render('sign_in', {
        errors: [info.message],
        user: req.user,
      });
    } else {
      req.login(user, (loginErr) => {
        if (loginErr) {
          return next(loginErr);
        }
        // Redirect to the home page or another destination
        res.redirect('/');
      });
    }
  })(req, res, next);
};

exports.log_out_get = asyncHandler(async (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect('/');
  });
});

exports.sign_off_get = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;
  req.logout(async (err) => {
    if (err) {
      return next(err);
    }
    await User.findByIdAndDelete(userId);
    res.redirect('/');
  });
});

exports.messages_create_get = asyncHandler(async (req, res, next) => {
  res.render('messages_create', { user: req.user });
});

exports.messages_create_post = [
  body('title').trim().isLength({ min: 1 }).escape(),
  body('content').trim().isLength({ min: 1 }).escape(),
  asyncHandler(async (req, res, next) => {
    console.log('working');
    const authorId = req.user._id;
    const newMessage = await new Message({
      title: req.body.title,
      content: req.body.content,
      author: authorId,
    });

    await newMessage.save();
    res.redirect('/');
  }),
];

exports.join_get = asyncHandler(async (req, res, next) => {
  res.render('join', { error: null, user: req.user });
});

exports.join_post = asyncHandler(async (req, res, next) => {
  if (req.body.password !== 'password') {
    res.render('join', { error: 'Incorrect password!', user: req.user });
  } else {
    const user = await User.findById(req.user._id);

    const userUpdated = new User({ ...user, _id:req.user._id ,isMembership: true });
  
    await User.findByIdAndUpdate(user._id, userUpdated);
    res.redirect('/');
  }
});

exports.admin_get = asyncHandler(async (req, res, next) => {
    res.render('admin', { error: null, user: req.user });
});

exports.admin_post = asyncHandler(async (req, res, next) => {
     if (req.body.password !== 'admin') {
       res.render('admin', { error: 'Incorrect password!', user: req.user });
     } else {
       const user = await User.findById(req.user._id);

       const userUpdated = new User({
         ...user,
         isMembership:true,
         _id: req.user._id,
         isAdmin: true,
       });

       await User.findByIdAndUpdate(user._id, userUpdated);
       res.redirect('/');
     }
});

exports.delete_get = asyncHandler(async (req, res, next) => {
      await Message.findByIdAndDelete(req.params.id);
      res.redirect('/')
});