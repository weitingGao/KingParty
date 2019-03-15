// 获取应用实例
// const app = getApp()
// var comm = require("../comm/comm.js");
// comm.init();

Page({
  data:{
    GodnessImg:"../../images/nvshen.jpeg",
    rankUpImg: "../../images/nanshen.jpg",
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    showModel: false,
    theCode:""//微信登录返回code
  },
  onLoad: function (options) {
    this.toLogin();
  },
  rankUp:function(){
    wx.navigateTo({
      url: '../shake/shake',
    });
    getApp().globalData.flag=false;
  },
  knowGodness:function(){
    wx.navigateTo({
      url: '../shake/shake',
    });
    getApp().globalData.flag=true;
  },
// 登录
toLogin:function(){
    var _this=this;
    var code;
  wx.login({
    success: res => {
      // 登录后获取code
      console.log(res.code);
      if (res.code) {
        code = res.code;
        _this.setData({
          theCode: code
        })
      }
      wx.getStorage({
        //获取本地储存的uid
        key: 'uid',
        success: function (res) {
          getApp().globalData.personIntr.uid = res.data;
          _this.getMore();//获取用户详细信息
          console.log(res);
        },
        fail: function (res) {
          console.log(res);
          console.log("首次登录");
          _this.setData({
            showModel: true
          })
          console.log(_this.data.showModel);
          // 获取用户信息
          // wx.getSetting({
          //   success: res => {
              //if (res.authSetting['scope.userInfo']) {
              // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
              // wx.getUserInfo({
              //   success: res => {
              //     console.log(res);
              //     var userInfo = res.userInfo;
              //     // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              //     // 所以此处加入 callback 以防止这种情况
              //     if (this.userInfoReadyCallback) {
              //       this.userInfoReadyCallback(res)
              //     }
        }
      })
    }
  })
 },
//请求位置信息
getposition:function(){
  var lat = "", lon = "";
  wx.getLocation({
    type: 'gcj02', //返回可以用于wx.openLocation的经纬度
    fail: function (res) {
      lat = 0;
      lon = 0;
      console.log("fail", res, lat, lon);
    },
    success: function (res) {
      lat = res.latitude
      lon = res.longitude
      console.log(lat, lon);
    },
    complete: function () {
      console.log(lat, lon);

    },
    fail: function (res) {
      console.log(res);
      console.log("获取信息失败");
    },

  })
},
getMore: function () {
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
//获取用户信息新接口
  agreeGetUser: function (e) {
    //设置用户信息本地存储
    try {
      wx.setStorageSync('userInfo', e.detail.userInfo)
    } catch (e) {
      wx.showToast({
        title: '系统提示:网络错误',
        icon: 'warn',
        duration: 1500,
      })
    }
    // wx.showLoading({
    //   title: '加载中...'
    // })
    let that = this
    that.setData({
      showModel: false
    })
    that.getOP(e.detail.userInfo)
    console.log(e.detail.userInfo);
  },
//提交用户信息 获取用户id
  getOP: function (res) {
    let that = this
    let userInfo = res
    var _this=this;
    // app.globalData.userInfo = userInfo
    wx.request({
      url: 'https://yyq.intech.gdinsight.com/index.php?m=Public&a=login',
      data: {
          code: _this.data.theCode,
          name: userInfo.nickName,
          sex: userInfo.gender,
          avatar: userInfo.avatarUrl,
          // latitude: lat,
          // longitude: lon
          latitude: '134',
          longitude: '234'
        },
        method: 'GET',
        header: { 'content-type': 'application/json' },
        success: function (res) {
          console.log("信息", res.data.userinfo);
          getApp().globalData.personIntr = res.data.userinfo;
          var nowId = res.data.userinfo.uid;
          getApp().globalData.personIntr.uid = nowId;
          //将uid储存到本地
          wx.setStorage({
            key: 'uid',
            data: nowId,
            success: function (res) {
              console.log(res);
              _this.getMore();//获取用户详细信息
            },
            fail: function (res) {
              console.log(res);
            }
          })
        },
        fail: function () {
          console.log("登录失败");
          wx.showToast({
            title: '登录失败',
            icon: 'warn',
            duration: 1500,
          })
        }
    })
  },
})
