// pages/acceptPage/acceptPage.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isEvaluate:true,
    isLike:0,
    popErrorMsg:'',
    avatar: '',
    nickname: '',
    level: '',
    costom_lab:'',
    evaluate_label:"",
    heroLabel: [],
    eva_label:[],
    heart:"http://img.intech.gdinsight.com/tencent/kingparty/a20180423/images/icon_heart.png",
    heart_like:"http://img.intech.gdinsight.com/tencent/kingparty/a20180423/images/icon_heart-like.png"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      avatar: getApp().globalData.otherIntr.avatar,
      nickname: getApp().globalData.otherIntr.name,
      level: getApp().globalData.otherIntr.lv_name,
    })
    if (this.data.avatar==null){
      this.setData({
        avatar: "http://img.intech.gdinsight.com/tencent/kingparty/a20180423/images/avatar.jpg"
      })
    }
    var _this = this;
    wx, wx.request({
      url: 'https://yyq.intech.gdinsight.com/index.php?m=api&a=get_eva_label',
      data: {
        uid: getApp().globalData.otherIntr.uid,
        fuid: getApp().globalData.personIntr.uid,
      },
      header: { 'content-type': 'application/json' },
      method: 'GET',
      dataType: 'json',
      success: function (res) {
       console.log("是否评价",res);
       if(res.data.data.length!==0||res.data.is_like!==null){
         _this.setData({
           isEvaluate:true,
           isLike:res.data.is_like,
           eva_label:res.data.data
         })
         _this.likeShow();
       }else{
         _this.setData({
           isEvaluate: false
         })
       }
      },
      fail: function (res) {
        console.log(res);
      },
      complete: function (res) { },
    })
    //console.log(getApp().globalData.otherIntr);
    
    wx: wx.request({
      url: 'https://yyq.intech.gdinsight.com/index.php?m=public&a=get_label',
      header: { 'content-type': 'application/json' },
      method: 'GET',
      data: {
        uid: getApp().globalData.personIntr.uid
      },
      dataType: 'json',
      success: function (res) {
        //console.log(res.data.data);
        _this.setData({
          heroLabel: res.data.data
        })
      },
      fail: function (res) {

      },
      complete: function (res) {
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },
  //自定义标签获取函数
  labInput: function (e) {
    this.setData({
      costom_lab: e.detail.value
    })
    //console.log(this.data.costom_lab);
  },
  //选择标签改变样式
  select_lab: function (e) {
    var newheroLabel = this.data.heroLabel;
    var Index = e.currentTarget.dataset.what;
    var select_true = 0;//统计目前已选个数
    for (var i = 0; i < newheroLabel.length; i++) {
      if (newheroLabel[i].is_select == 1) {
        select_true++;
      }
    }
    //console.log(select_true);
    if (select_true < 5) {
      if (newheroLabel[Index].is_select == false) {
        newheroLabel[Index].is_select = true;
      } else {
        newheroLabel[Index].is_select = false;
      }
      //console.log(newheroLabel[Index].is_select);
      this.setData({
        heroLabel: newheroLabel
      })
    } else {
      if (newheroLabel[Index].is_select == true) {
        newheroLabel[Index].is_select = false;
        this.setData({
          heroLabel: newheroLabel
        })
      } else {
        var _this = this;
        _this.setData({
          popErrorMsg: "不好意思，最多只能选5个标签哦！"
        })
        setTimeout(function () {
          _this.setData({
            popErrorMsg: ""
          })
        }, 1500)
      }
    }
  },
  //添加标签
  addLab: function () {
    var labValue = this.data.costom_lab;
    var newheroLabel2 = this.data.heroLabel;
    var select_true = 0;//统计目前已选个数
    var newJson = {
      name: labValue,
      is_select: true
    }
    for (var i = 0; i < newheroLabel2.length; i++) {
      if (newheroLabel2[i].is_select == 1) {
        select_true++;
      }
    }
    if (labValue !== "") {
      if (select_true < 5) {
        newheroLabel2.push(newJson);
        this.setData({
          heroLabel: newheroLabel2
        })
      } else {
        var _this = this;
        _this.setData({
          popErrorMsg: "不好意思，最多只能选5个标签哦！"
        })
        setTimeout(function () {
          _this.setData({
            popErrorMsg: ""
          })
        }, 1500)
      }
    }
  },
  submit_eval:function(){
    var newlable = [];
    for (var i = 0; i < this.data.heroLabel.length; i++) {
      if (this.data.heroLabel[i].is_select == 1) {
        newlable.unshift(this.data.heroLabel[i].name);
      }
    }
    newlable = newlable.join(',');
    this.setData({
      evaluate_label: newlable
    })
//标签
    if (this.data.isLike!== 0 || this.data.evaluate_label!==""){
      var _this = this;
      wx.request({
        url: 'https://yyq.intech.gdinsight.com/index.php?m=api&a=submit_eva',
        data: {
          uid: getApp().globalData.personIntr.uid,
          to: getApp().globalData.otherIntr.uid,
          label: _this.data.evaluate_label
        },
        header: { 'content-type': 'application/json' },
        method: 'GET',
        dataType: 'json',
        success: function (res) {
          console.log(res);
          console.log(_this.data.evaluate_label);
        },
        fail: function (res) {
          console.log(res);
        }
      })
//点赞
      if(_this.data.isLike==1){
        wx.request({
          url: 'https://yyq.intech.gdinsight.com/index.php?m=api&a=like',
          data: {
            uid: getApp().globalData.personIntr.uid,
            to: getApp().globalData.otherIntr.uid
          },
          header: { 'content-type': 'application/json' },
          method: 'GET',
          dataType: 'json',
          success: function (res) {
            console.log('点赞成功', res);
          },
          fail: function (res) { },
          complete: function (res) { },
        })
      }
    }else{
      _this.setData({
        popErrorMsg: "不好意思，请点赞或者选择标签才可以提交评论哦"
      })
      setTimeout(function () {
        _this.setData({
          popErrorMsg: ""
        })
      }, 1500)
    }
    


    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2];  //上一个页面
    prevPage.setData({
      showModal: false
    })
    wx.switchTab({
      url: '../message/message',
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  tolike:function(){
    if (this.data.isLike == 0) {
      this.setData({
        isLike:1
      })
    }else{
      this.setData({
        isLike:0
      })
    } 
    this.likeShow();
  },
  likeShow:function(){
    if(this.data.isLike==0){
      this.setData({
        heart: "http://img.intech.gdinsight.com/tencent/kingparty/a20180423/images/icon_heart.png",
      })
    }else{
      this.setData({
        heart: "http://img.intech.gdinsight.com/tencent/kingparty/a20180423/images/icon_heart-like.png",
      })
    }
  },
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
  
  }
})