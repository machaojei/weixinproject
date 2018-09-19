
const app = getApp()
const db = wx.cloud.database()

Page({

  data: {
    openid: ''
  },

  onLoad: function (options) {
    this.setData({
      openid: getApp().globalData.openid
    })

    this.queryAllOrder();
  },

  queryAllOrder: function () {
    const cloud = require('../../wx-server-sdk')
    cloud.init()
    const MAX_LIMIT = 100
    exports.main = async (event, context) => {
      // 先取出集合记录总数
      const countResult = await db.collection('subscribe').count()
      const total = countResult.total
      // 计算需分几次取
      const batchTimes = Math.ceil(total / 100)
      // 承载所有读操作的 promise 的数组
      const tasks = []
      for (let i = 0; i < batchTimes; i++) {
        const promise = db.collection('subscribe').skip(i * MAX_LIMIT).limit(MAX_LIMIT).where({
          _openid: this.data.openid
        })
          .get()
        tasks.push(promise)
      }
      // 等待所有
      return (await Promise.all(tasks)).reduce((acc, cur) => {
        return {
          data: acc.data.concat(cur.data),
          errMsg: acc.errMsg,
        }
      })
    }

  }
})