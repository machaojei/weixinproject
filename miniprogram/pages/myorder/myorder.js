const app = getApp()
const db = wx.cloud.database()

var openid = ''
var orderList = null
Page({

  data: {
    orderList: []
  },

  onLoad: function (options) {
    openid = app.globalData.openid
    wx.showLoading({
      title: '加载中',
    })
    this.queryAllOrder();
  },
  queryAllOrder: function () {
    var that = this
    wx.cloud.callFunction({
      // 云函数名称
      name: 'getAllOrder',
      // 传给云函数的参数
      success: function (res) {
        console.log(res.result)
        that.setData({
          orderList: res.result.data
        })
        wx.hideLoading()
      },
      fail: console.error
    })

  },
  /**
   * 点击item 拨打用户电话
   */
  bindViewTap: function (e) {
    var phone = e.currentTarget.dataset.phone;
    wx.makePhoneCall({
      phoneNumber: phone
    })
  },
  confirmorder: function (e) {
    var orderstatus = e.currentTarget.dataset.orderstatus;
    var phone = e.currentTarget.dataset.phone;
    var name = e.currentTarget.dataset.name;
    var that = this
    if (orderstatus == 1) {
      wx.showLoading({
        title: '加载中',
      })
      console.log('订单更新===' + name + phone + 'orderstatus==' + orderstatus)
      wx.cloud.callFunction({
        // 云函数名称
        name: 'updateorder',
        data: {
          name: name,
          phone: phone,
        },
        // 传给云函数的参数
        success: function (res) {
          console.log('订单更新===' + res)
          setTimeout(function () {
            that.queryAllOrder() //要延时执行的代码
          }, 1000) //延迟时间 这里是1秒

        },
        fail: console.error
      })
    } else {
      wx.makePhoneCall({
        phoneNumber: phone
      })
    }
  },

  /**   
   * 预览图片  
   */
  previewImage: function (e) {
    var current = e.target.dataset.src;
    var list = [];
    list = list.concat(current);
    console.log(current)
    console.log(list)
    wx.previewImage({
      current: current, // 当前显示图片的http链接  
      urls: list // 需要预览的图片http链接列表  
    })
  },


  pullDownRefreshData: function (context) {
    this.queryAllOrder();
    wx.stopPullDownRefresh()
  }


})