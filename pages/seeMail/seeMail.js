// pages/seeMail/seeMail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    activeNames: ['1'],
    letter_title: "",
    accept_phone: "",
    write_phone: "",
    letter_date: "",
    letter_content: "",
    letter_id: "",
    not_read: 0,
    letter_photo_1:"",
    letter_photo_2:""
  },
  onChange: function (event) {
    getApp().toPage(event);
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const item = JSON.parse(decodeURIComponent(options.item));
    console.log("item:", item);
    this.setData({
      accept_phone: item["accept_phone"],
      write_phone: item["write_phone"],
      letter_date: item["letter_date"],
      letter_title: item["letter_title"],
      letter_content: item["letter_content"],
      letter_id: item["letter_id"],
      letter_photo_1: item["letter_photo_1"],
      letter_photo_2: item["letter_photo_2"],
      
    });
    console.log()
    // 判断是否已经读过了
    if ( item["not_read"]== 1) { // 没读过
      wx.request({
        url: 'http://127.0.0.1:8000/setLetterRead/' + this.data.letter_id,
        method: "GET",
        header: {
          'content-type': 'application/json' // 默认值
        },
        success:(res)=>{
          console.log("信件以读");
          this.setData({
            not_read:0
          })
        }
      })
    }
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

  },
  panelChange: function (event) {
    // this.data.letter_title = "我是陈小坚"
    this.setData({
      activeNames: event.detail,
      // letter_title:this.data.letter_title
    })
  },
  return_letter: function () {
    wx.redirectTo({
      url: '/pages/addMail/addMail',
    })
  },
  delete_letter: function () {
    console.log("this.data.id:", this.data.letter_id)
    wx.showModal({
      content: '是否删除邮件',
      success: (res) => {
        if (res.confirm) {
          wx.request({
            url: 'http://127.0.0.1:8000/deleteLetter/' + this.data.letter_id,
            method: "GET",
            header: {
              'content-type': 'application/json' // 默认值
            },
            success: (res) => {
              if (res.data.msg == "success") {
                wx.showToast({
                  title: '删除成功',
                })
                wx.redirectTo({
                  url: '/pages/myMail/myMail',
                })
              }
            }
          })
        }
      }
    })
  }
})