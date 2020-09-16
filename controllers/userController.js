const nodemailer = require('nodemailer'); //引入依赖
const dbConfig = require('../util/dbconfig');
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
// let sendCodeM = (email) =>{
//     for(var item of validateMailCode){
//         if(email == item.email){
//             return true
//         }
//         return false
//     }
// };
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
    let reg = /^\w[-\w.+]*@(163)\.+com$/;
    let regq = /^\w[-\w.+]*@(qq)\.+com$/;
    let transporter,info;
    if (reg.test(email)){
        /**
         * 详细配置文件地址： node_modules/lib/well-known/services
         */
         transporter = nodemailer.createTransport({
            host: 'smtp.163.com',
            port: 465,
            secure: true,
            auth: {
                user: '15728325635@163.com', //发送方邮箱
                pass: 'KRVVPEWPTRWECPXK' //发送方邮箱的授权码,一般去邮箱设置里面找，应该可以找到
            }
        });
         info = {
            from: '15728325635@163.com',//发送方邮箱
            // 收件人
            to:email,//前台传过来的邮箱
            subject: '接受凭证',//邮箱主题
            text:  `你的验证码${code}`//发送验证码
            //html: '<h1>这里内容</h1>'，text和html任选其一即可
        };
        //发送邮件
    }else if (regq.test(email)){
        /**
         * 详细配置文件地址： node_modules/lib/well-known/services
         */
         transporter = nodemailer.createTransport({
            host:"smtp.qq.com", //qq smtp服务器地址
            secureConnection:false, //是否使用安全连接，对https协议的
            port: 465,
            auth: {
                user: '1393597501@qq.com', //发送方邮箱
                pass: 'hwmkvdccqtwuhhig' //发送方邮箱的授权码,一般去邮箱设置里面找，应该可以找到
            }
        });
         info = {
            from: '1393597501@qq.com',//发送方邮箱
            // 收件人
            to:email,//前台传过来的邮箱
            subject: '接受凭证',//邮箱主题
            text:  `你的验证码${code}`//发送验证码
            //html: '<h1>这里内容</h1>'，text和html任选其一即可
        };
    }else {
       console.log('发送邮箱验证出问题！')
    }
    // if(sendCodeM(email)){
    //     res.send({
    //         'code':400,
    //         'msg':'我考！怎么又发验证码啊'
    //     });
    //     return
    // }
    transporter.sendMail(info,(err,data) => {
        if(err){
            console.log('err:',err);
             res.send({
                'code':400,
                'msg':'发送失败'
            });
             return
        }else{
            res.send({
                'code':200,
                'data':data
            });
            validateMailCode.push({
                'email':email,
                'code':code
            });
            console.log("validateMailCode:",validateMailCode)
        }
    });
};
let emailLoginBind = async (email) =>{
    let sql = "select * from user where username=? or email = ?";
    let sqlArr = [email,email];
    let res = await dbConfig.SySqlConnect(sql,sqlArr);
    if (res.length){
        res[0].userInfo = await getUserInfo(res[0].id);
        return res
    } else {
            //用户第一次登录.绑定表 //用户注册
        let res = await regUser(email);
            //获取用户详情
        res[0].userInfo = await getUserInfo(res[0].id);
        return res
    }
};
//用户注册
    let regUser = async (email) =>{
        let userpic = 'https://upload.jianshu.io/users/upload_avatars/1447174/5b2925ac-99cb-4efc-b3b5-826eb4895273.jpg?imageMogr2/auto-orient/strip|imageView2/1/w/240/h/240';
        let sql = 'insert into user(username,userpic,email,create_time) value(?,?,?,?)';
        let sqlArr = [email,userpic,email,(new Date()).valueOf()];
        let res = await dbConfig.SySqlConnect(sql,sqlArr);
        if (res.affectedRows == 1){
            //执行成功获取用户信息
            //获取用户信息的方法
            let user = await getUser();
            //创建用户副表
            let userinfo = '/do';
            if (userinfo.affectedRows == 1){
                return user
            } else {
                return false
            }
        }else {
                return false
        }
    };
//获取用户信息
    let getUser = (username)=>{
      let sql = 'sqlect * from user where id=? or email=? or username=?';
      let sqlArr = [username,username,username];
      return dbConfig.SySqlConnect(sql,sqlArr);
    };
    let createUserInfo = (user_id)=>{
      let sql = 'insert into userinfo(user_id,age,sex,job) values(?,?,?,?)';
      let sqlArr = [user_id,18,2,'未设置'];
      return dbConfig.SySqlConnect(sql,sqlArr);
    };
    let getUserInfo = (user_id)=>{
        let sql = `select age,sex,job,path,birthday from userinfo where user_id=?`;
        let sqlArr = [user_id];
        return dbConfig.SySqlConnect(sql,sqlArr);
    };

//验证码登录
codeEmailLogin = (req,res)=>{
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
};
module.exports = {
    sendCoreMail,
    codeEmailLogin
};