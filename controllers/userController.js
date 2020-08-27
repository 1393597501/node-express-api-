// const dbconfig = require('../util/dbconfig');
function rand(min,max){
    return Math.floor(Math.random()*(max-min)) + min
}
validatePhoneCode = [];
let = sendCodeP = (phone) =>{
    validatePhoneCode.map(v=>{

        if(phone == v.phone){
               return true 
        }
    })
    return false
}
let = findCodeAndPhone = (phone,code) =>{
    validatePhoneCode.map(v=>{
        if(phone == v.phone&&code == v.code){
            return 'login' 
        }
    })
    return 'error'
}
//模拟验证码发送接口
sendCode = (req,res) =>{
    let phone = req.query.phone;
    if(sendCodeP(phone)){
        res.send({
            'code':400,
            'msg':'我考！怎么又发验证码'
        })
    }
    let code = rand(1000,9999);
    validatePhoneCode.push({
        'phone':phone,
        'code':code
    })
    
    console.log('code:',code,'validatePhoneCode:',validatePhoneCode);
    res.send({
        'code':200,
        'msg':'发送成功'
    })
}
//验证码登录
codePhoneLogin = (req,res)=>{
    let {phone,code} = req.query;
    //该手机号是否发送过验证码
    if(sendCodeP(phone)){
        //验证码和手机号是否匹配
       let status = findCodeAndPhone(phone,code);
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
    sendCode,
    codePhoneLogin
}