// pages/my/my.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    active: 4,
    nickname: "chen",
    userPhone: ''
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {

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
    this.setData({
      userPhone:getApp().globalData.userPhone
    })
    if(this.data.userPhone==''){
      setTimeout(() => {
        wx.showToast({
          title: 'Please bind the phone',
          icon: "none"
        })
      }, 1000);
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
  // 切换页面
  onChange: function (event) {
    getApp().toPage(event);
  },
  // logoff 解绑手机
  logoff:function(e){
    this.setData({
      userPhone:getApp().globalData.userPhone = ''
    })
    wx.showToast({
      title: 'Log off succeed',
    })

  }

})
