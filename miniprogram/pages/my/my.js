
const app = getApp()

Page({
  data: {
    openid:'',
    logged: false,
    takeSession: false,
    requestResult: ''
  },

  onLoad: function () {
    openid = getApp().globalData.openid
    if (!wx.cloud) {
      wx.redirectTo({
        url: '../index/index',
      })
      return
    }
 
},


})