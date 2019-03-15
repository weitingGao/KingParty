//app.js
//小程序ID： wx78e0f7ca8dba69fa   secret： 765f19f7b78acd48a01476c88301e49c
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    var code;
    var nowId;
    var _this=this;

    //请求位置信息
      // wx.getLocation({
      //   type: 'gcj02', //返回可以用于wx.openLocation的经纬度
      //   success: function (res) {
      //     var latitude = res.latitude
      //     var longitude = res.longitude
      //     console.log(latitude, longitude)
      //     var lat2=23.32463;
      //     var lon2=113.36290;
      //     var radLat1 = latitude*Math.PI/180.0;
      //     var radLat2 = lat2*Math.PI/180.0;
      //     var a = radLat1 - radLat2;
      //     var b = longitude * Math.PI / 180.0 - lon2 *Math.PI / 180.0;
      //     var s = 2* Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(radLat1) *Math.cos(radLat2) *Math.pow(Math.sin(b / 2), 2)));
      //     s = s* 6378.137;
      //     s = Math.round(s * 10000) / 10000;
      //     var s = s.toFixed(2)//得出距离（公里）
      //     console.log(s);
      //   }
      // })
    //请求段位，擅长位置，英雄信息
     wx.request({
      url: 'https://yyq.intech.gdinsight.com/index.php?m=public&a=get_level',
      header: { 'content-type': 'application/json' },
      method: 'GET',
      dataType: 'json',
      success: function (res) {
        getApp().globalData.level=res.data.data
        console.log("段位信息", getApp().globalData.level)
      },
      fail: function (res) {

      },
      complete: function (res) {

      }
    })
     wx.request({
      url: 'https://yyq.intech.gdinsight.com/index.php?m=public&a=get_place',
      header: { 'content-type': 'application/json' },
      method: 'GET',
      dataType: 'json',
      success: function (res) {
        getApp().globalData.places = res.data.data
        console.log("擅长位置", getApp().globalData.places)
      },
      fail: function (res) {

      },
      complete: function (res) {

      }
    })
    wx.request({
       url: 'https://yyq.intech.gdinsight.com/index.php?m=public&a=get_hero',
       header: { 'content-type': 'application/json' },
       method: 'GET',
       dataType: 'json',
       success: function (res) {
         getApp().globalData.heroes = res.data.data
         console.log("英雄信息", getApp().globalData.heroes)
       },
       fail: function (res) {

       },
       complete: function (res) {

       }
    })
    
  },

  getMore:function(){
    //获取用户详细信息
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
      },
      fail: function () {
        console.log("获取信息失败");
      }
    })
  },

  //跳转设置页面授权
  openSetting: function () {
    var that = this
    if (wx.openSetting) {
      wx.openSetting({
        success: function (res) {
          //尝试再次登录
          that.onLaunch();
          console.log("尝试再次登录");
        }
      })
    } else {
      wx.showModal({
        title: '授权提示',
        content: '小程序需要您的微信授权才能使用哦~ 错过授权页面的处理方法：删除小程序->重新搜索进入->点击授权按钮'
      })
    }
  },
  globalData: {
    // myId:'',
    userY:false,
    flag:true,
    level:[],
    places:[],
    heroes:[],
    cardType:"1",
    personIntr: {},
    otherIntr: {},
    //personCardRight:"editMyCard",
    // userInfo: null
  }
})