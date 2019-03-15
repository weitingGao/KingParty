function init(config) {
  if(typeof config == "undefined"){
    config = {};
  }
  config.onShareAppMessage = function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    if(!config.shareTitle){
      config.shareTitle = "游友圈-游戏玩家的聚居地。"
    }
    return {
      title: config.shareTitle,
      path: '/pages/index/index?id=123',
      success: function (res) {
        // 转发成功
        wx.showToast({
          title: '转发成功！',
          icon: 'success',
          duration: 2000
        })
      },
      fail: function (res) {
        // 转发失败
        wx.showToast({
          title: '转发失败！',
          icon: 'loading',
          duration: 2000
        })
      }
    }
  }

  function commReady(){
    wx.showShareMenu({
      withShareTicket: true
    })
  }
  if(typeof config.onReady == "function"){
    var onReady = config.onReady;
    config.onReady = function(){
      onReady();
      commReady();
    }
  }else{
    config.onReady = function(){
      commReady();
    }
  }
  //事件处理函数
  config.bindViewTap = function () {
      wx.navigateTo({
        url: '../logs/logs'
      })
  }
  Page(config)
} 
module.exports.init = init;