const app = getApp()
const db = wx.cloud.database()

Page({
  data: {
    openid: getApp().globalData.openid,
    ordernum: '',
    ordertotalprice: '',
    logged: false,
    takeSession: false,
    requestResult: ''
  },

  onLoad: function() {
    this.queryAllOrder()
  },

  queryAllOrder: function () {
    wx.cloud.callFunction({
      // 云函数名称
      name: 'getAllOrder',
      // 传给云函数的参数
      success: function (res) {
        console.log(res.result)
        app.globalData.orderList = res.result.data
        console.log(app.globalData.orderList)
      },
      fail: console.error
    })

  },
})