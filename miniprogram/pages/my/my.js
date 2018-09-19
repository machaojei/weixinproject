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
  },


})