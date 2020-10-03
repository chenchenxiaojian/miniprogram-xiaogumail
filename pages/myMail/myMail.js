// pages/myMail/myMail.js
import Toast from '../../vantweapp/toast/toast'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    active: 1,
    letters: [] // 信件


  },
  onChange: function (event) {
    getApp().toPage(event);
  },
  refresh: function (event) {
    Toast.loading({
      message: '加载中...',
      forbidClick: true,
      duration: 1000
    });
    var url = 'http://127.0.0.1:8000/getLatestLetters/' + getApp().globalData.userPhone;
    wx.request({
      url: url,
      method: "GET",
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: (res) => {
        if (res.data.msg == "success") {
          console.log(res)

          if (res.data.response_data.length != 0) {
            this.data.letters = res.data.response_data
            console.log("点击刷新");
            setTimeout(() => {
              this.setData({
                letters: this.data.letters
              })
            }, 1200);
          } else {
            setTimeout(() => {
              wx.showToast({
                title: '没有数据',
              })
            }, 1500);

          }
        } else {
          setTimeout(() => {
            wx.showToast({
              title: '请求失败',
              icon: "none"
            })
          }, 1000)

        }
      },
      fail: (res) => {
        wx.showToast({
          title: '刷新失败',
          icon: "none"
        })
      }

    })
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
    }else{
      console.log("11111111")
      this.refresh();
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

  }
})