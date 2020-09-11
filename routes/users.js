var express = require('express');
var router = express.Router();
var user = require('../controllers/userController');
var send_sms = require('../controllers/nodemailer');
/* GET users listing. */
router.post('/sendCode',user.sendCode); //测试模拟验证码
router.post('/sendCoreCode',user.sendCoreCode);
router.post('/sendCoreMail',send_sms.sendCoreMail);
router.post('/codePhoneLogin',user.codePhoneLogin);
module.exports = router;