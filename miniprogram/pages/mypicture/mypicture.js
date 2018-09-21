const app = getApp()
const db = wx.cloud.database()

var openid = ''
var imageList = null
Page({

  data: {
    imageList: []
  },

  onLoad: function (options) {
    openid = app.globalData.openid
    wx.showLoading({
      title: '加载中',
    })
    try {
    this.getAllPicturePath();
    }catch(error) {
      wx.hideLoading()
    }
  },
  getAllPicturePath: function () {
    var that = this
    wx.cloud.callFunction({
      // 云函数名称
      name: 'getAllPicturePath',
      // 传给云函数的参数
      success: function (res) {
        console.log(res.result)
        that.setData({
          imageList: res.result.data
        })
        wx.hideLoading()
      },
      fail: console.error
    })

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