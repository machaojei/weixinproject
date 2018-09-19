//index.js


var openid = ''

Page({
  data: {
    openid: '',
    clothstyle: '',
    name: '',
    address: '',
    phone: '',
    userInfo:{},
    requestResult: '',
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
    clothstyle = e.detail.value
  },

  nameConfirm: function(e) {
    name = e.detail.value
  },

  phoneConfirm: function(e) {
    phone = e.detail.value
  },

  addressConfirm: function(e) {
    address = e.detail.value
  },

  confirm: function(e) {
    if (clothstyle.length == 0) {
      wx.showToast({
        title: '请输入款式!',
        icon: 'none'
      })
      return
    }
    if (name.length == 0) {
      wx.showToast({
        title: '请输入姓名!',
        icon: 'none'
      })
      return
    }
    if (phone.length == 0) {
      wx.showToast({
        title: '请输入手机号!',
        icon: 'none'
      })
      return
    }
    uploadSubscribe()
    wx.showToast({
      title: '预定成功!',
    })
  },

  uploadSubscribe: function() {
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;

    db.collection('subscribe').add({
      // data 字段表示需新增的 JSON 数据
      data: {
        // _id 可选自定义 _id，在此处场景下用数据库自动分配的就可以了
        openid: openid,
        nickname: userInfo.nickName,
        name: name,
        phone: phone,
        address: address,
        date: timestamp,
      },
      success: function(res) {
        // res 是一个对象，其中有 _id 字段标记刚创建的记录的 id
        console.log(res)
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