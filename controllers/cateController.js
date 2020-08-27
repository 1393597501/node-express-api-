const dbconfig = require('../util/dbconfig');

getCate = (req,res) =>{
    var sql = "select * from cate";
    var sqlArr = [];
    var callBack = (err,data) =>{
        if(err){
          console.log('连接失败')
        }else{
          res.send({
            'list':data
          })
        }
    }
    dbconfig.sqlConnect(sql,sqlArr,callBack);
}
getPostCate = (req,res) =>{
  let {id} = req.query;
  var sql = "select * from post where cate_id=?";
  var sqlArr = [id];
  var callBack = (err,data) =>{
      if(err){
          console.log('连接失败');
      }else{
        res.send({
          'list':data
        })
      }
  }
  dbconfig.sqlConnect(sql,sqlArr,callBack);
}
module.exports = {
    getCate,
    getPostCate
}