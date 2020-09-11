var express = require('express');
var router = express.Router();
var user = require('../controllers/userController');
/* GET users listing. */
router.post('/sendCoreMail',user.sendCoreMail);
router.post('/codePhoneLogin',user.codePhoneLogin);
module.exports = router;