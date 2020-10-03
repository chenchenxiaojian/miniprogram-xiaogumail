//app.js

App({
  data: {

  },
  globalData: {
    userPhone:''
  },
  toPage:function (event) {
    var pageList = new Array(
      "/pages/addMail/addMail",
      "/pages/myMail/myMail",
      "",
      "",
      "/pages/my/my",
    )
    wx.redirectTo({
      url: pageList[event.detail]
    })
  },
  onLaunch:function(){
    wx.cloud.init({
      env:"chenchenxiaojian-jc1zw"
    })
  }
})
