// const dbconfig = require('../util/dbconfig');
const Core = require('@alicloud/pop-core');
const config = require('../util/aliconfig');

let client = new Core(config.alicloud);   
let requestOption = {
    method: 'POST'
  };
function rand(min,max){
    return Math.floor(Math.random()*(max-min)) + min
}
validatePhoneCode = [];
let sendCodeP = (phone) =>{
    for(var item of validatePhoneCode){
        if(phone == item.phone){
            return true 
     }
     return false
    }
}
let findCodeAndPhone = (phone,code) =>{
    for(var item of validatePhoneCode){
        if(phone == item.phone&&code == item.code){
            return 'login' 
     }
     return 'error'
    }
};

sendCoreCode = (req,res) =>{
    let phone = req.query.phone;
    let code = rand(1000,9999);
    var params = {
        "RegionId": "cn-hangzhou",
        "PhoneNumbers": phone,
        "SignName":"变美app",
        "TemplateCode":"SMS_200721240",
        "TemplateParam": JSON.stringify({"code":code})
      }
    
      client.request('SendSms', params, requestOption).then((result) => {
        console.log("result:",result);
        if(result.Code == "ok"){
            res.send({
                "code":200,
                "msg":'发送成功'
            })
            validatePhoneCode.push({
                'phone':phone,
                'code':code
            });
            console.log("code：",code)
        }else{
            res.send({
                "code":200,
                "msg":"发送失败"
            })
        }

      })
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
    sendCoreCode,
    codePhoneLogin
}