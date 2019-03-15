// pages/me/me.js
// const event = require('../../utils/event.js');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    heart:"http://img.intech.gdinsight.com/tencent/kingparty/a20180423/images/icon_heart-like.png",
    heroLabel:[],
    personIntr:[],
    male: "http://img.intech.gdinsight.com/tencent/kingparty/a20180423/images/male.png",
    female: "http://img.intech.gdinsight.com/tencent/kingparty/a20180423/images/female.png",
    editMyCard: "http://img.intech.gdinsight.com/tencent/kingparty/a20180423/images/icon_editMyCard.png"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    this.innerAudioContext = wx.createInnerAudioContext();
    this.innerAudioContext.onPlay(() => {
      console.log('开始播放')
    })
    this.innerAudioContext.onEnded((res) => {
      console.log('播放结束');
      wx.showToast({
        title: '播放结束',
        icon: 'success',
        duration: 1000
      })
    })
    this.innerAudioContext.onError((res) => {
      console.log("播放录音失败",res)
    })

    var _this=that;
    wx:wx.request({
      url: 'https://yyq.intech.gdinsight.com/index.php?m=api&a=get_eva_label',
      data:{
        uid: getApp().globalData.personIntr.uid
      },
      header: { 'content-type': 'application/json' },
      method: 'GET',
      dataType: 'json',
      success: function (res) {
       console.log(res);
        _this.setData({
          heroLabel:res.data.data
        })
      },
      fail: function (res) {

      },
      complete: function (res) {

      }
    })
  },
  //点击播放录音 
  videoPlay: function () {
    var that = this;
    var filePath = 'https://yyq.intech.gdinsight.com'+getApp().globalData.personIntr.voice.path;
    console.log(filePath, getApp().globalData.personIntr.voice);
    this.innerAudioContext.src = filePath;
    this.innerAudioContext.play();
  },

  edit: function () {
    wx.navigateTo({
      url: '../../pages/editMyCard/editMyCard',
    })
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
    // var ret = { "data": '{"data":{"url":"www.baidu.com","length":"3"},"status":"success"}' };
    // var aa=JSON.parse(ret.data);
    // console.log("lll",aa);
    var _this=this;
    wx.request({
      url: 'https://yyq.intech.gdinsight.com/index.php?m=Api&a=get_user_hero',
      data: {
        uid: getApp().globalData.personIntr.uid,
      },
      method: 'GET',
      header: { 'content-type': 'application/json' },
      success: function (res) {
        console.log(res);
        getApp().globalData.personIntr = res.data.info;
        _this.setData({
          personIntr: getApp().globalData.personIntr
        })
      },
      fail: function () {
        console.log("获取信息失败");
      }
    })
    
    console.log(getApp().globalData.personIntr)
    // getApp().globalData.personCardRight = "editMyCard";
    //event.emit('refrshData');
    //console.log("我的", getApp().globalData.personCardRight)

    // var page = getCurrentPages().pop();
    // //页面刷新(微信小程序使用switchTab跳转后页面不刷新的问题)
    // // console.log(page.onLoad());
    // if (page == undefined || page == null) return;
    // page.onLoad(); 

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
    // event.off('refrshData', this.refrshData)
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