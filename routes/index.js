var express = require('express');
var router = express.Router();
const controller = require('../controllers/appController')

/* GET home page. */


router.get('/sign-up', controller.sign_up_get)
router.post('/sign-up', controller.sign_up_post)
router.get('/', controller.main_page);
module.exports = router;
