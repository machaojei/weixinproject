
const app = getApp()
const db = wx.cloud.database()

var openid = ''
Page({

  data: {

  },

  onLoad: function (options) {
        openid = getApp().globalData.openid

    this.queryAllOrder();
  },

  queryAllOrder: function () {
    wx.cloud.callFunction({
      // 云函数名称
      name: 'getAllOrder',
      // 传给云函数的参数
      success: function (res) {
        console.log(res.result) 
      },
      fail: console.error
    })

  }
})