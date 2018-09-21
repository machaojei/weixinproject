const app = getApp()

var ordernum = 0
const db = wx.cloud.database()

Page({
  data: {
    ordernum:0,
    ordertotalprice: '',
    pics: [],
    logged: false,
    takeSession: false,
    requestResult: ''
  },

  onShow: function() {
    this.queryOrderNum()
  },

  choose: function () { //这里是选取图片的方法
    var that = this,
      　　　　　　pics = this.data.pics;
    wx.chooseImage({
      count: 9 - pics.length, // 最多可以选择的图片张数，默认9
      sizeType: ['compressed'], // original 原图，compressed 压缩图，默认二者都有
      sourceType: ['album', 'camera'], // album 从相册选图，camera 使用相机，默认二者都有
      success: function (res) {
        var imgsrc = res.tempFilePaths;
        pics = pics.concat(imgsrc);
        that.setData({
          pics: pics
        });
      },
      fail: function () {
        // fail
      },
      complete: function () {
        var pics = that.data.pics;
        if (pics.length == 0) {
          return
        }
        wx.showLoading({
          title: '上传中',
        })
        that.uploadPictures({
          path: pics//这里是选取的图片的地址数组
        })
      }
    })

  },
  /**
     * 上传多张图片素材
     */
  uploadPictures: function (data) {
    //多张图片上传
    var that = this,
      i = data.i ? data.i : 0, //当前上传的哪张图片
      success = data.success ? data.success : 0, //上传成功的个数
      fail = data.fail ? data.fail : 0; //上传失败的个数
    const filePath = data.path[i]
    // 上传图片
    var timestamp = Date.parse(new Date()) / 1000;
    const cloudPath = 'picture/' + timestamp+i +".jpg"
    wx.cloud.uploadFile({
      cloudPath: cloudPath,
      filePath: data.path[i],
      success: (resp) => {
        success++; //图片上传成功，图片上传成功的变量+1
        console.log(resp)
        that.addPictureToDb({
          cloudPath: cloudPath
        })
        //这里可能有BUG，失败也会执行这里,所以这里应该是后台返回过来的状态码为成功时，这里的success才+1
        if (i+1 == data.path.length) { //当图片传完时，停止调用          
          that.setData({
            pics: []
          });
          wx.hideLoading()
          wx.showToast({
            title: '上传完毕^_^',
          })
        } else { //若图片还没有传完，则继续调用函数
          i++; //这个图片执行完上传后，开始上传下一张
          data.i = i;
          data.success = success;
          data.fail = fail;
          that.uploadPictures(data);
        }
      },
      fail: (res) => {
        fail++; //图片上传失败，图片上传失败的变量+1
      },
      complete: () => {
      }
    });

  },

  addPictureToDb:function(data) {
    console.log(data)
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;

    db.collection('picture').add({
      // data 字段表示需新增的 JSON 数据
      data: {
        // _id 可选自定义 _id，在此处场景下用数据库自动分配的就可以了
        openid: app.globalData.openid,
        cloudPath: "https://6261-bazhuayumessage-8ec91f-1257651340.tcb.qcloud.la/" + data.cloudPath,
        date: timestamp
      },
      success: function (res) {
        console.log('添加成功!')
      },
      fail: function (res) {
        console.log('添加失败!')
      }
    })
  },

  queryOrderNum:function() {
    var that = this
    wx.cloud.callFunction({
      // 云函数名称
      name: 'ordernum',
      // 传给云函数的参数
      success: function (res) {
        console.log(res.result.data)
        that.setData({
          ordernum: res.result.data.total,
        })
      },
      fail: console.error
    })
  }

})