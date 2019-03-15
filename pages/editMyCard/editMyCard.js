// pages/editMyCard/editMyCard.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    popErrorMsg:'',
    popVoice:false,
    popVoice2: false,
    voice_info:"点击开始语音介绍",
    index1:'',//段位
    index2: '',//位置
    male: "http://img.intech.gdinsight.com/tencent/kingparty/a20180423/images/male.png",
    female: "http://img.intech.gdinsight.com/tencent/kingparty/a20180423/images/female.png",
    idx:'',
    costom_lab:'',//自定义标签
    voice: "",
    voice_len: "",
    lovehero: {
      id: '',
      name: ''
    },
    level_array: [],
    position_array: [],
    personIntr: {},
    heroLabel: [],
  },
  //选择器函数
  bindPickerChange1:function(e){
    this.setData({
      index1: e.detail.value
    })
  },
  bindPickerChange2: function (e) {
    this.setData({
      index2: e.detail.value
    })
  },
  // //昵称获取函数
  // nameInput:function(e){
  //   this.setData({
  //     'personIntr.nickname': e.detail.value
  //   })
  //   //console.log(this.data.personIntr.nickname);
  // },
  //自定义标签获取函数
  labInput:function(e){
    this.setData({
      costom_lab: e.detail.value
    })
    //console.log(this.data.costom_lab);
  },
  //选择标签改变样式
  select_lab:function(e){
    var newheroLabel = this.data.heroLabel;
    var Index = e.currentTarget.dataset.what;
    var select_true=0;//统计目前已选个数
    for (var i = 0; i < newheroLabel.length; i++){
      if(newheroLabel[i].is_select==1){
        select_true++;
      }
    }
    //console.log(select_true);
    if (select_true<5){
      if (newheroLabel[Index].is_select == false) {
        newheroLabel[Index].is_select = true;
      } else {
        newheroLabel[Index].is_select = false;
      }
      //console.log(newheroLabel[Index].is_select);
      this.setData({
        heroLabel: newheroLabel
      })
    }else{
      if (newheroLabel[Index].is_select == true) {
        newheroLabel[Index].is_select = false;
        this.setData({
          heroLabel: newheroLabel
        })
      }else{
        var _this=this;
        _this.setData({
          popErrorMsg: "不好意思，最多只能选5个标签哦！"
        })
        setTimeout(function(){
          _this.setData({
            popErrorMsg: ""
          })
        }, 1500)
      }
    }
  },
  //添加标签
  addLab:function(){
    var labValue = this.data.costom_lab;
    var newheroLabel2 = this.data.heroLabel;
    var select_true = 0;//统计目前已选个数
    var newJson={
      name: labValue,
      is_select:true
    }
    for (var i = 0; i < newheroLabel2.length; i++) {
      if (newheroLabel2[i].is_select == 1) {
        select_true++;
      }
    }
    if (labValue!==""){
      if (select_true < 5) {
        newheroLabel2.push(newJson);
        this.setData({
          heroLabel: newheroLabel2
        })
      }else{
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
//录入微信号
textInput:function(e){
  var textvalue = e.detail.value;
   this.setData({
     'personIntr.wechat': textvalue
   })
},
//录音弹框
  toRecord:function(){
    this.setData({
      popVoice: true
    })
  },
  
  recorderS:function(){
    console.log("开始录音");
    this.recorderManager.start({
      format: 'mp3',
      duration:10000
    });
  },
  recorderE: function () {
    console.log("结束录音");
    this.recorderManager.stop();
    var that=this;
    that.setData({
      popVoice2:true
    })
  },
  //完成录音
  finishVoice:function(){
    console.log("关掉");
    //保存文件
    var tempFilePaths = this.data.voice;
    var _this=this;
    wx.saveFile({
      tempFilePath: tempFilePaths,
      success: function (res) {
        var savedFilePath = res.savedFilePath;
        _this.setData({
          voice: savedFilePath
        })
        console.log("本地录音路径", _this.data.voice);
    //上传录音文件
        wx.uploadFile({
          url: 'https://yyq.intech.gdinsight.com/index.php?m=api&a=submit_card_audio', 
          filePath: _this.data.voice,
          name: 'file',
          formData: {
            'uid': getApp().globalData.personIntr.uid,
            'length': _this.data.voice_len
          },
          success: function (res) {
            console.log(res.data);
            var n_voices = res.data.split(',');
            console.log(n_voices);
            _this.setData({
              voice: n_voices[0],
              voice_info: n_voices[0],
              voice_len: n_voices[1]
            })
            wx.showToast({
              title: '录音保存成功',
              icon: 'success',
              duration: 1000
            });

            console.log(_this.data.voice);
          }
        })
      }
    })
    this.setData({
      popVoice:false
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    this.recorderManager = wx.getRecorderManager();
    this.recorderManager.onError(function () {
      that.tip("录音失败！")
    });
    this.recorderManager.onStart(() => {
      console.log('recorder start')
      wx.showLoading({
        title: '录音中...',
      })
    })
    this.recorderManager.onStop(function (res) {
      wx.hideLoading();
      wx.showToast({
        title: '录音结束',
        icon: 'success',
        duration: 1000
      })
      // console.log('recorder stop', res)
      const { tempFilePath, duration } = res
      let recorderTempFilePath = tempFilePath;
      let playDuration = Math.ceil(duration / 1000);
      that.setData({
        voice: recorderTempFilePath,
        voice_len: playDuration
      })
      console.log(that.data.voice, playDuration);
    });

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
      that.tip("播放录音失败！")
    })
    that.setData({
      // 'personIntr.avatar': getApp().globalData.personIntr.avatar,
      // 'personIntr.nickname': getApp().globalData.personIntr.name,
      // 'personIntr.sex': getApp().globalData.personIntr.sex,
      // 'personIntr.wechat': getApp().globalData.personIntr.wechat,
      personIntr: getApp().globalData.personIntr,
      level_array: getApp().globalData.level,
      position_array: getApp().globalData.places,
      'lovehero.name': getApp().globalData.personIntr.hero_name,
      'lovehero.id': getApp().globalData.personIntr.hero_id,
      index1: (getApp().globalData.personIntr.lv_id-1),
      index2: (getApp().globalData.personIntr.place_id-1)
    })
    var _this = that;
    //请求系统评价标签
    wx: wx.request({
      url: 'https://yyq.intech.gdinsight.com/index.php?m=public&a=get_label',
      header: { 'content-type': 'application/json' },
      method: 'GET',
      data:{
        uid:getApp().globalData.personIntr.uid
      },
      dataType: 'json',
      success: function (res) {
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
  //提示信息
  tip: function (msg) {
    wx.showModal({
      title: '提示',
      content: msg,
      showCancel: false
    })
  },
  //生成名片
  toEdit: function () {
    //console.log(this.data.personIntr.wechat);
    // console.log(this.data.personIntr.voice);
    // console.log(getApp().globalData.personIntr.uid);
    // console.log(this.data.personIntr.position_array[this.data.index2].id);
    // console.log(this.data.personIntr.level_array[this.data.index1].id);
    // console.log(this.data.personIntr.lovehero.id);
    var newlable=[];
    for (var i = 0; i < this.data.heroLabel.length; i++) {
      if (this.data.heroLabel[i].is_select == 1) {
        newlable.unshift(this.data.heroLabel[i].name);
      }
    }
    newlable = newlable.join(',');
    this.setData({
      'personIntr.label': newlable
    })
    var _this=this;
    console.log("录音",_this.data.voice)
    wx.request({
      url: 'https://yyq.intech.gdinsight.com/index.php?m=api&a=submit_card_info',
      data:{
        uid: getApp().globalData.personIntr.uid,
        place_id: _this.data.position_array[_this.data.index2].id,
        label: _this.data.personIntr.label,
        level_id: _this.data.level_array[_this.data.index1].id,
        hero_id: _this.data.lovehero.id,
        voice: _this.data.voice,
        voice_len: _this.data.voice_len,
        wechat: _this.data.personIntr.wechat
      },
      header: { 'content-type': 'application/json' },
      method: 'GET',
      dataType: 'json',
      success: function (res) {
       console.log(res);
      },
      fail: function (res) {
        console.log(res);
      },
      complete: function (res) {
      }
    })
    
    wx.switchTab({
      url: '../me/me',
    })
    
  },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },
  btnClose:function(){
    this.setData({
      popVoice: false
    })
  },

  //点击播放录音 
  gotoPlay: function () {
    var that = this;
    var filePath = that.data.voice;
    console.log(filePath);
    this.innerAudioContext.src = filePath;
    this.innerAudioContext.play()
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // this.setData({
    //   heroLabel: getApp().globalData.hero.heroLabel
    // })
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