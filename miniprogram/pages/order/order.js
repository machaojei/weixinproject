//index.js

// var clothstyle = ''
// var name = ''
// var address = ''
// var phone = ''
// var memo = ''
// var price = '' //定金
const app = getApp()

var openid = ''
var userInfo = null
var common = require("../index/util.js");
var queryResult = ''
var piccount = 0
const db = wx.cloud.database()
Page({
  data: {
    clothstyle: '',
    name: '',
    phone: '',
    address: '',
    memo: '',
    price: '',
    requestResult: '',
    showOrHidden: false, //判断显示与否的，true表示显示，反之隐藏
    canIUseClipboard: wx.canIUse('setClipboardData')
  },

  onReady: function() {
    wx.getUserInfo({
      success: function(res) {
        userInfo = res.userInfo
        openid = getApp().globalData.openid
      }
    })
  },

  styleConfirm: function(e) {
    this.setData({
      clothstyle: e.detail.value
    })
    // clothstyle = e.detail.value
  },

  nameConfirm: function(e) {
    this.setData({
      name: e.detail.value
    })
    // name = e.detail.value
  },

  phoneConfirm: function(e) {
    this.setData({
      phone: e.detail.value
    })
    // phone = e.detail.value
  },

  addressConfirm: function(e) {
    this.setData({
      address: e.detail.value
    })
    // address = e.detail.value
  },

  priceConfirm: function(e) {
    this.setData({
      price: e.detail.value
    })

    // price = e.detail.value
  },

  memoConfirm: function(e) {
    this.setData({
      memo: e.detail.value
    })
    // memo = e.detail.value
  },
  // 清空输入框
  reset: function() {
    this.setData({
      clothstyle: '',
      name: '',
      phone: '',
      address: '',
      memo: '',
      price: '',

    })
    app.globalData.cloudPath = ''
    app.globalData.fileID = ''
  },

  confirm: function(e) {
    if (this.data.name == '') {
      wx.showToast({
        title: '请输入姓名!',
        icon: 'none'
      })
      return
    }
    if (this.phone == '') {
      wx.showToast({
        title: '请输入手机号!',
        icon: 'none'
      })
      return
    }
    if (this.data.phone.substring(0, 1) != 1) {
      wx.showToast({
        title: '请输入正确的手机号!',
        icon: 'none'
      })
      return
    }
    console.log('开始插入')
    this.uploadSubscribe() // 插入记录

  },

  // 插入预约记录
  uploadSubscribe: function() {
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;

    db.collection('subscribe').add({
      // data 字段表示需新增的 JSON 数据
      data: {
        // _id 可选自定义 _id，在此处场景下用数据库自动分配的就可以了
        _openid: openid,
        nickname: userInfo.nickName,
        name: this.data.name,
        phone: this.data.phone,
        address: this.data.address,
        memo: this.data.memo,
        price: this.data.price,
        totalprice:'',
        cloudPath: app.globalData.cloudPath,
        fileID: app.globalData.fileID,
        date: timestamp

      },
      success: function(res) {
        console.log('插入成功')
        wx.showToast({
          title: '添加成功!',
        })

        this.reset()
      }
    })
  },
  // 查询预订记录
  queryRecord: function() {
    db.collection('subscribe').where({
        _openid: openid
      })
      .get({
        success: function(res) {
          console.log('blank==' + common.isBlank(res.data))
          if (common.isBlank(res.data)) {

          } else {

          }
        }

      })
  },
  // 更新已有记录
  updateRecord: function() {
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;

    db.collection('subscribe').doc(openid).update({
      // data 传入需要局部更新的数据
      data: {
        name: name,
        phone: phone,
        address: address,
        date: timestamp,
      },
      success: function(res) {
        console.log(res.data)
      }
    })
  },

  // 上传图片
  doUpload: function() {
    // 选择图片
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function(res) {

        wx.showLoading({
          title: '上传中',
        })

        const filePath = res.tempFilePaths[0]

        // 上传图片
        var timestamp = Date.parse(new Date());
        timestamp = timestamp / 1000;

        const cloudPath = 'picture/' + timestamp + filePath.match(/\.[^.]+?$/)[0]
        wx.cloud.uploadFile({
          cloudPath,
          filePath,
          success: res => {
            console.log('[上传文件] 成功：', res)

            app.globalData.fileID = res.fileID
            app.globalData.cloudPath = cloudPath
            console.log(cloudPath)
          },
          fail: e => {
            console.error('[上传文件] 失败：', e)
            wx.showToast({
              icon: 'none',
              title: '上传失败',
            })
          },
          complete: () => {
            wx.hideLoading()
          }
        })

      },
      fail: e => {
        console.error(e)
      }
    })
  },



  copyCode: function(e) {
    var codeId = e.target.dataset.codeId
    wx.setClipboardData({
      data: code[codeId - 1],
      success: function() {
        util.showSuccess('复制成功')
      }
    })
  }
})