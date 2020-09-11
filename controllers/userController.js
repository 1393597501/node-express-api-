const nodemailer = require('nodemailer'); //引入依赖

/**
 * 发送邮件
 * @param {string} to 收件方邮箱
 * @param {string} title 内容标题
 * @param {string} content 邮件内容
 * @param {Function} callback 回调函数（内置参数）
 *
 */
function rand(min,max){
    return Math.floor(Math.random()*(max-min)) + min
}
validateMailCode = [];
let sendCodeM = (email) =>{
    for(var item of validateMailCode){
        if(email == item.email){
            return true
        }
        return false
    }
};
let findCodeAndEmail = (email,code) =>{
    for(var item of validateMailCode){
        if(email == item.email&&code == item.code){
            return 'login'
        }
        return 'error'
    }
};
sendCoreMail = (req,res) => {
    const email = req.query.email;
    let code = rand(1000,9999);
    /**
     * 详细配置文件地址： node_modules/lib/well-known/services
     */
    let transporter = nodemailer.createTransport({
        host: 'smtp.163.com',
        port: 465,
        secure: true,
        auth: {
            user: '15728325635@163.com', //发送方邮箱
            pass: 'KRVVPEWPTRWECPXK' //发送方邮箱的授权码,一般去邮箱设置里面找，应该可以找到
        }
    });

    let info = {
        from: '15728325635@163.com',//发送方邮箱
        // 收件人
        to:email,//前台传过来的邮箱
        subject: '接受凭证',//邮箱主题
        text:  `你的验证码${code}`//发送验证码
        //html: '<h1>这里内容</h1>'，text和html任选其一即可
    };
    //发送邮件
    transporter.sendMail(info,(err,data) => {
        if(err){
            console.log('err:',err);
            res.send({
                'code':400,
                'msg':'发送失败'
            });
            return
        }else{
            if(sendCodeM(email)){
                res.send({
                    'code':400,
                    'msg':'我考！怎么又发验证码a '
                })
            }
            res.send({
                'code':200,
                'data':data
            });
            validateMailCode.push({
                'email':email,
                'code':code
            });
        }
    })
};
//验证码登录
codePhoneLogin = (req,res)=>{
    let {email,code} = req.query;
    //该手机号是否发送过验证码
    if(sendCodeM(email)){
        //验证码和手机号是否匹配
       let status = findCodeAndEmail(email,code);
       if(status=='login'){
            //登录成功
            //登录成功之后的操作
            res.send({
                'code':200,
                'msg':'登录成功'
            })
       }else if(status=='error'){
        res.send({
            'code':200,
            'msg':'登录失败'
        }) 
       }
    }else{
        res.send({
            'code':400,
            'msg':'未发送验证码'
        })
    }
}
module.exports = {
    sendCoreMail,
    codePhoneLogin
};