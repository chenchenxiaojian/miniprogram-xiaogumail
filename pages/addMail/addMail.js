// pages/addMail/addMail.js


Page({

  data: {
    active: 0,
    userPhone: '',
    checked: false,
    sms: '',
    second_checked: false,
    title: "",
    content: "",
    accept_phone: '',
    fileList: []
  },
  checkboxClick(event) {
    // console.log("111");
    this.data.userPhone = this.data.userPhone != "***********" ? "***********" : getApp().globalData.userPhone;
    this.setData({
      checked: event.detail,
      userPhone: this.data.userPhone
    })
  },
  second_checkboxClick(event) {
    this.setData({
      second_checked: event.detail
    })
  },
  getIdCode: function () {
    wx.request({
      url: 'http://127.0.0.1:8000/getsms',
      method: "get",
      success: (res) => {
        this.setData({
          sms: res.data.sms
        })
        console.log("返回验证码成功：", res.data.sms) // 验证码
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      fail: function (res) {
        console.log('api return sms fail...');
      }
    });
  },
  submitLetter: function (event) {
    var accept_phone = this.data.accept_phone;
    var title = this.data.title;
    var content = this.data.content;
    var sms = this.data.sms;
    var second_checked = this.data.second_checked;
    if (!accept_phone || !title || !content || !sms || !second_checked) {
      wx.showToast({
        title: '请完善信息',
        icon: "none",
        deration: 1000
      })
      return;
    }
    if (this.data.accept_phone == getApp().globalData.userPhone) {
      wx.showToast({
        title: '不能给自己写信',
        icon: "none"
      })
      return;
    }
    var data = {
      "sms": this.data.sms,
      "userPhone": this.data.userPhone
    }
    wx.request({
      url: "http://127.0.0.1:8000/checksms",
      method: "POST",
      data: data,
      header: {
        "Content-Type": "application/json"
      },
      success: (res) => {
        if (res.data.msg == "succeed") { // 验证成功 
          // console.log("验证成功")
          var isanonymous = this.data.userPhone == "***********" ? "true" : "false";
          var letter_data = {
            "write_phone": getApp().globalData.userPhone,
            "accept_phone": this.data.accept_phone,
            "title": this.data.title,
            "content": this.data.content,
            "isanonymous": isanonymous,
            "fileList":this.data.fileList
          }
          wx.request({
            url: 'http://127.0.0.1:8000/addmail',
            method: "POST",
            data: letter_data,
            header: {
              "Content-Type": "application/json"
            },
            success: (res) => {
              if (res.data.msg == "succeed") {
                wx.showToast({
                  title: '投递成功',
                });
                setTimeout(() => {
                  wx.redirectTo({
                    url: '/pages/addMail/addMail',
                  })
                }, 2000);
              } else {
                wx.showToast({
                  title: '投递失败',
                  icon: "none"
                })
              }
            },
            fail: (res) => {
              wx.showToast({
                title: '投递失败',
              })
            }
          })
        } else {
          wx.showToast({
            title: '验证码错误',
            icon: "none"
          })
        }

      },
      fail: (res) => {
        console.log(res.data.msg)
      }
    })

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {},

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.data.userPhone = getApp().globalData.userPhone;
    console.log("当前phone为:", this.data.userPhone)
    this.setData({
      userPhone: this.data.userPhone
    })
    if (getApp().globalData.userPhone == '') {
      wx.showToast({
        title: '请先绑定手机',
        icon: 'none',
        duration: 1000,
        success: function (e) {
          setTimeout(() => {
            wx.redirectTo({
              url: '/pages/reg/reg',
            })
          }, 1000)
        }
      });
    }

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  onChange: function (event) {
    getApp().toPage(event);
  },
  delete_photo(event) {         // 删除图片的操作
    let imgIndex = event.detail.index;
    let fileList = this.data.fileList
    fileList.splice(imgIndex, 1)
    this.setData({
      fileList: fileList
    })
  },
  afterRead: function () {
    var that = this
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePaths = res.tempFilePaths;
        console.log(tempFilePaths[0]);
        that.upLoadImg(tempFilePaths[0]);
      }
    })
  },
  upLoadImg: function (fileURL) {
    wx.cloud.uploadFile({
      cloudPath: new Date().getTime() + '.png',
      filePath: fileURL, // 临时文件路径
      success: res => {
        console.log(res.fileID);
        const fileList = this.data.fileList;
        fileList.push({url:res.fileID});
        this.setData({
          fileList:fileList
        });
        console.log(this.data.fileList);
      },
      fail: console.error
    })

  }
})