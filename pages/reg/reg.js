// pages/reg/reg.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    active: 4,
    userPhone: '',
    sms: '',
    checked: false,
    second_checked:false
  },
  // event.detail的值为当前选中项的索引
  onChange: function (event) {
    getApp().toPage(event);
  },
  getIdCode: function (event) {
    // console.log(111);
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
  submitMessage: function (e) {
    if (!this.data.checked) {
      wx.showModal({
        cancelColor: '',
        title: 'Tips',
        content: 'Please agree the protocol'
      })
      return;
    }
    if (!this.data.userPhone || !this.data.sms) {
      wx.showModal({
        cancelColor: '',
        content: 'Please fill the phone and sms!',
        title: 'Tips'
      })
    }
    var data = {
      "userPhone": this.data.userPhone,
      "sms": this.data.sms
    };
    wx.request({
      url: "http://127.0.0.1:8000/checksms",
      method: "POST",
      header: {
        // "Content-Type": "application/x-www-form-urlencoded"
        "Content-Type": "application/json"
      },
      data: data,
      success: function (res) {
        // console.log(res.data.msg,res.data.userPhone)
      
        if (res.data.msg == "succeed") {  // 绑定成功
          console.log("post userPhone and sms to server success...")
          var app = getApp()
          app.globalData.userPhone = res.data.userPhone
          wx.showToast({
            title: '绑定成功',
            icon: 'success',
            duration: 1000,
            success: function () {
              setTimeout(() => {
                wx.redirectTo({
                  url: '/pages/my/my',
                })
              }, 1000);
            }
          })
        }

      },
      fail: function (res) {
        console.log("fail to post userPhone and sms to server...")
      }
    })
  },
  checkboxClick: function (event) { // 复选框点击事件
    this.setData({
      checked: event.detail
    });
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

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

  }
})