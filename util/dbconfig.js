const mysql = require('mysql');
module.exports = {
    //数据量配置
    config:{
        host: 'localhost',
        port:'3306',
        user:'root',
        password:'root',
        database:'exapp',
    },
    //数据库链接,使用mysql的连接池的链接方式
    //连接池对象
    sqlConnect:function(sql,sqlArr,callBack){
        const pool = mysql.createPool(this.config);
        pool.getConnection((err,conn)=>{
            if(err){
                return console.log('连接失败');
            }
        //事件驱动回调
        conn.query(sql,sqlArr,callBack);
        //释放连接
        conn.release();
        })


    },
    SySqlConnect:function (sySql,sqlArr) {
        return new Promise((resolve,reject)=>{
            const pool = mysql.createPool(this.config);
            pool.getConnection((err,conn)=>{
                if(err){
                    return console.log('连接失败');
                }
                //事件驱动回调
                conn.query(sql,sqlArr,(err,data)=>{
                    if (err){
                        reject(err)
                    } else {
                        resolve(data)
                    }
                });
                //释放连接
                conn.release();
            })
        }).catch((err)=>{
            console.log(err)
        })
    }
}