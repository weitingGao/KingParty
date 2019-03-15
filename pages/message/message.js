// message.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    page:1,
    close_M:'http://img.intech.gdinsight.com/tencent/kingparty/a20180423/images/icon_close.png',
    Modaltype:'',
    good:true,
    showModal: false,
    avatar:'http://img.intech.gdinsight.com/tencent/kingparty/a20180423/images/avatar.jpg',
    nickname:'lili',
    level:'最强王者',
    knowtime:'2018.3.12',
    eval_word: ["最强刺客", "牛逼", "最强刺客", "牛逼", "靠谱", "最强刺客", "牛逼", "靠谱"],
    messAll:[],
    friendInfo:{},
    messContent:"",
    mess_style:[] 
  },
 
  /**
     * 弹出框蒙层截断touchmove事件
     */
  preventTouchMove: function () {
  },
  /**
   * 隐藏模态对话框
   */
  closeModal: function () {
    this.setData({
      showModal: false
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {  

  },
  toEvaluate:function(){ 
    wx.navigateTo({
      url: '../evaluate/evaluate'
    })   
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },
  // 改变已读信息的样式
  readStatus: function () {
    var new_messAll = this.data.messAll;
    var new_mess_style=[];
    for (var i = 0; i < new_messAll.length; i++) {
      if (new_messAll[i].is_read == "1") {
        new_mess_style.push("mess2");
      }else{
        new_mess_style.push("mess");
      }
    }
    this.setData({
      mess_style: new_mess_style
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var _this = this;
    wx, wx.request({
      url: 'https://yyq.intech.gdinsight.com/index.php?m=api&a=msg_list',
      data: {
        uid: getApp().globalData.personIntr.uid,
        limit: 10,
        page: 1
      },
      header: { 'content-type': 'application/json' },
      method: 'GET',
      dataType: 'json',
      success: function (res) {
        console.log(res);
        _this.setData({
          messAll: res.data.msg,
          page:1
        });
        console.log(_this.data.messAll[0].is_read);
        _this.readStatus();
      },
      fail: function (res) {
        console.log(res);
      },
      complete: function (res) { },
    })
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
    var _this=this;
    wx, wx.request({
      url: 'https://yyq.intech.gdinsight.com/index.php?m=api&a=msg_list',
      data: {
        uid: getApp().globalData.personIntr.uid,
        limit: 10,
        page: _this.data.page+1
      },
      header: { 'content-type': 'application/json' },
      method: 'GET',
      dataType: 'json',
      success: function (res) {
        console.log("xin",res);
        var newmessAll = _this.data.messAll.concat(res.data.msg);
        _this.setData({
          messAll: newmessAll,
          page: _this.data.page + 1
        })
        _this.readStatus();
      },
      fail: function (res) {
        console.log(res);
      },
      complete: function (res) { },
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
  goReceiveMsg:function(e){
    var newIndex = e.currentTarget.dataset.index;
    //console.log(newIndex);
    var newlabe = this.data.messAll[newIndex].type;
    // this.setData({
    //   Modaltype: newlabe
    // })
    getApp().globalData.cardType = "2";
    var _this=this;
    wx.request({
      url: 'https://yyq.intech.gdinsight.com/index.php?m=api&a=msg_read',
      data:{
        uid: getApp().globalData.personIntr.uid,
        mid: _this.data.messAll[newIndex].id
      },
      method: 'GET',
      header: { 'content-type': 'application/json' },
      success: function (res) {
        // console.log(res.data.data.content);
        _this.setData({
          messContent:res.data.data.content
        })
        var frendId = res.data.data.uid;
        wx.request({
          url: 'https://yyq.intech.gdinsight.com/index.php?m=Api&a=get_user_hero',
          data: {
            uid: frendId,
          },
          method: 'GET',
          header: { 'content-type': 'application/json' },
          success: function (res) {
            getApp().globalData.otherIntr = res.data.info;
            console.log("对方",getApp().globalData.otherIntr);
            getApp().globalData.cardType="2";
            _this.setData({
              friendInfo: res.data.info
            })
            //判断消息类型
            //如果为邀请信息
            if (newlabe == "2") {
              //getApp().globalData.personCardRight = "like";
              wx.navigateTo({
                url: '../receiveMsg/receiveMsg?messContent=' + _this.data.messContent
              })
            } else if (newlabe == "3"){//如果为提醒评价
                wx:wx.request({
                  url: 'https://yyq.intech.gdinsight.com/index.php?m=api&a=get_eva_user',
                  data:{
                    uid: getApp().globalData.personIntr.uid,
                    fuid:getApp().globalData.otherIntr.uid,
                  },
                  header: {'content-type': 'application/json'},
                  method: 'GET',
                  dataType: 'json',
                  success: function(res) {
                    console.log(res);
                    _this.setData({
                    knowtime: res.data.data.date,             
                    Modaltype: newlabe   
                    })
                  },
                  fail: function(res) {},
                  complete: function(res) {},
                })
                _this.setData({
                  showModal: true
                })
            }
            else if (newlabe == "5"){
              //getApp().globalData.personCardRight = "wechat";
              _this.setData({
                showModal: true,
                Modaltype: newlabe
              })
            }
          },
          fail: function () {
            console.log("获取信息失败");
          }
        })
      },
      fail: function () {
        console.log("获取信息失败");
      }
    })

    if (newlabe == "4") {//收到评价
      wx.showToast({
        title: '加载中',
        icon: 'loading',
        duration: 1500
      }) 
      setTimeout(function(){
        wx.request({
          url: 'https://yyq.intech.gdinsight.com/index.php?m=api&a=get_eva_label',
          data: {
            uid: getApp().globalData.personIntr.uid,
            fuid: getApp().globalData.otherIntr.uid,
          },
          header: { 'content-type': 'application/json' },
          method: 'GET',
          dataType: 'json',
          success: function (res) {
            console.log("收到评价", res);
            _this.setData({
              eval_word: res.data.data,
              good: res.data.is_like,
              Modaltype: newlabe,
              showModal: true
            })
          },
          fail: function (res) {
            console.log(res);
          },
          complete: function (res) { }
        })
      },1500)     
    }

  },
  goMain: function (){
    this.setData({
      showModal: false
    })
    wx.switchTab({
      url: '../main/main',
    })
  },
})