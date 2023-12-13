var express = require('express');
var router = express.Router();
const controller = require('../controllers/appController')

const isLogged = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/sign-in');
};


router.get('/sign-up', controller.sign_up_get)
router.post('/sign-up', controller.sign_up_post)
router.get('/sign-in', controller.sign_in_get)
router.post('/sign-in', controller.sign_in_post)
router.get('/log-out', controller.log_out_get)
router.get('/sign-off', isLogged, controller.sign_off_get)
router.get('/messages/create', isLogged, controller.messages_create_get),
router.post('/messages/create', isLogged, controller.messages_create_post)
router.get('/join', isLogged, controller.join_get);
router.post('/join', isLogged, controller.join_post);
router.get('/admin', isLogged, controller.admin_get);
router.post('/admin', isLogged, controller.admin_post);
router.get('/:id/delete', isLogged, controller.delete_get)
router.get('/', controller.main_page);

module.exports = router;
