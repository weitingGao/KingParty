 // pages/receiveMsg/receiveMsg.js
// const event = require('../../utils/event.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    male: "http://img.intech.gdinsight.com/tencent/kingparty/a20180423/images/male.png",
    female: "http://img.intech.gdinsight.com/tencent/kingparty/a20180423/images/female.png",
    heart: "http://img.intech.gdinsight.com/tencent/kingparty/a20180423/images/icon_heart-like.png",
    fromer: '',
    msgContent:'',
    liao: false,
    personIntr:[],
    personCardRight:""
  },

  changeRight:function(){
    var _this=this;
    wx.request({
      url: 'https://yyq.intech.gdinsight.com/index.php?m=api&a=invite_accept',
      data: {
        uid: getApp().globalData.personIntr.uid,
        fuid:getApp().globalData.otherIntr.uid,
      },
      header: { 'content-type': 'application/json' },
      method: 'GET',
      dataType: 'json',
      success: function(res) {
        console.log(res);
        //event.emit('refrshData');
        _this.setData({
          liao: true,
          personCardRight:"wechat"
        })
      },
      fail: function(res) {
        console.log(res);
      },
      complete: function(res) {},
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log("是我",getApp().globalData.otherIntr);
    //getApp().globalData.personCardRight = "like",
    this.setData({
      msgContent: options.messContent,
      fromer: getApp().globalData.otherIntr.name,
      personCardRight: "like",
      personIntr: getApp().globalData.otherIntr
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
    //event.remove('refrshData', this.refrshData)
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