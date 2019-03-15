// pages/shakeResult/shakeResult.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // ourl:'http://yyq.intech.gdinsight.com',
    male: "http://img.intech.gdinsight.com/tencent/kingparty/a20180423/images/male.png",
    female: "http://img.intech.gdinsight.com/tencent/kingparty/a20180423/images/female.png",
    heart: "http://img.intech.gdinsight.com/tencent/kingparty/a20180423/images/icon_heart-like.png",
    personCard:[],
    modalHidden:true,
    to_someone: "Lily ZH",
    remainWords:150,
    textareaValue:"",
    more_words_content: ["设计师都没有啊XXX", "文案大大在哪里QAQ", "前端表示无能为力XXX"],
    toUid:"",
    length:[]
  },
  
  modalTap: function (e) {
    var n_toUid = this.data.personCard[e.currentTarget.dataset.index].uid;//英雄卡uid
    var n_toname = this.data.personCard[e.currentTarget.dataset.index].name;
    // console.log(n_toUid);
    this.setData({
      modalHidden: false,
      toUid:n_toUid,
      to_someone:n_toname
    })
  },

  modalChange: function (e) {
    this.setData({
      modalHidden: true
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("屏幕宽高", wx.getSystemInfoSync().windowWidth, wx.getSystemInfoSync().windowHeight )
    getApp().globalData.cardType="2";
    var sex;
    if (getApp().globalData.flag){
      sex=2;
    }else{
      sex=1;
    }
    var _this=this;
    wx.request({
      url: 'https://yyq.intech.gdinsight.com/index.php?m=Api&a=shake',
      data:{
        uid: getApp().globalData.personIntr.uid,
        sex:sex,
        limit:5
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log(res.data);
        var len={
          latitude:"",
          longitude:""
        };
        var lenArray=[];
        for(var i = 0; i < res.data.list.length;i++){
          len.latitude=res.data.list[i].latitude;
          len.longitude = res.data.list[i].longitude;
          // lenArray.push(len);
          if (len.latitude !== null && len.longitude !== null && len.latitude !== "0" && len.longitude !== "0"){
            var lat1= getApp().globalData.personIntr.latitude;
            var lon1 = getApp().globalData.personIntr.longitude;
            var lat2 = len.latitude;
            var lon2 = len.longitude;
            var radLat1 = lat1 * Math.PI / 180.0;
            var radLat2 = lat2*Math.PI/180.0;
            var a = radLat1 - radLat2;
            var b = lon1 * Math.PI / 180.0 - lon2 *Math.PI / 180.0;
            var s = 2* Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(radLat1) *Math.cos(radLat2) *Math.pow(Math.sin(b / 2), 2)));
            s = s* 6378.137;
            s = Math.round(s * 10000) / 10000;
            var s = s.toFixed(2)//得出距离（公里）
            console.log(s);
            lenArray.push(s);
          }else{
            lenArray.push("x");
          }
        }
        console.log(lenArray);
        _this.setData({
         personCard:res.data.list,
         length: lenArray
        })
      }
    })
  },
  addtext:function(e){
    // console.log(e.currentTarget.dataset.index);
    var newtext;
    newtext = this.data.textareaValue + e.currentTarget.dataset.index;
    this.setData({
      textareaValue: newtext
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
  checkLen:function(e){
    var value = e.detail.value, len = parseInt(value.length);
    // console.log(value)
    if(len>150)return;
    this.setData({
      remainWords:150-len
    })
    this.setData({
      textareaValue: value
    })
  },
  shake_again:function(){
    wx.redirectTo({
      url: '../shake/shake',
    })
  },
  modalsubmit:function(){
    var _this = this;
    if (_this.data.textareaValue!==""){
      wx.request({
        url: 'https://yyq.intech.gdinsight.com/index.php?m=api&a=msg_invite',
        data: {
          uid: getApp().globalData.personIntr.uid,
          to: _this.data.toUid,
          msg: _this.data.textareaValue
        },
        header: {
          'content-type': 'application/json' // 默认值
        },
        success: function (res) {
          console.log(res.data);
          _this.setData({
            textareaValue: "",
            modalHidden: true
          })
          wx.showToast({
            title: '发送成功',
            icon: 'success',
            duration: 500
          })
        }
      })
    }else{
      console.log("请输入消息")
    }  
  }
})