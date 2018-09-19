
const app = getApp()
const db = wx.cloud.database()

var openid = ''
var orderList = null
Page({

  data: {
    orderList: app.globalData.orderList
  },

  onLoad: function (options) {
    openid = app.globalData.openid
    console.log(app.globalData.orderList) 
    // this.queryAllOrder();
  },

  queryAllOrder: function () {
    wx.cloud.callFunction({
      // 云函数名称
      name: 'getAllOrder',
      // 传给云函数的参数
      success: function (res) {
        console.log(res.result) 
        orderList = res.result.data
        console.log(orderList) 
      },
      fail: console.error
    })

  },
  pullDownRefreshData: function (context) {
    let params = {
      pageIndex: 1,
    };
      wx.stopPullDownRefresh()
  }


})