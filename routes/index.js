var express = require('express');
var router = express.Router();
const controller = require('../controllers/appController')

/* GET home page. */


router.get('/sign-up', controller.sign_up_get)
router.post('/sign-up', controller.sign_up_post)
router.get('/sign-in', controller.sign_in_get)
router.post('/sign-in', controller.sign_in_post)
router.get('/log-out', controller.log_out_get)
router.get('/sign-off', controller.sign_off_get)
router.get('/', controller.main_page);
module.exports = router;
