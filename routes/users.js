const express = require('express');
const router = express.Router();
const user = require('../controllers/userController');
/* GET users listing. */
router.post('/sendCoreMail',user.sendCoreMail);
router.post('/codePhoneLogin',user.codeEmailLogin);
module.exports = router;