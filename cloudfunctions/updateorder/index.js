// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  // 更新已有记录
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;

  var name = event.name 
  var phone = event.phone 

 return await db.collection('subscribe').where({
      name:name,
      phone:phone
  })
  .update({
      // data 传入需要局部更新的数据
      data: {
        orderstatus: 2
      },
      success: function (res) {
        console.log(res.data)
      }
    })
  
}