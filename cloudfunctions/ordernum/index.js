// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  var openid = await cloud.callFunction({
    name: 'login'
  })

  // 取出集合记录总数
  var countResult = await db.collection('subscribe').count()
  return {
    data: countResult,
  }
}