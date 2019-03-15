// components/personCard/personCard.js
// const event = require('../../utils/event.js');
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    male: "http://img.intech.gdinsight.com/tencent/kingparty/a20180423/images/male.png",
    female: "http://img.intech.gdinsight.com/tencent/kingparty/a20180423/images/female.png",
    heart: "http://img.intech.gdinsight.com/tencent/kingparty/a20180423/images/icon_heart-like.png",
    personIntr: {},
    personCardRight: "wechat",
    editMyCard: "http://img.intech.gdinsight.com/tencent/kingparty/a20180423/images/icon_editMyCard.png"
  },
  
  attached: function () {
    // event.on('refrshData', this, function () {
    //   console.log("刷新数据");
    //   this.setData({
    //     personCardRight: getApp().globalData.personCardRight,
    //   })
    // })
    
    //cardType为1时，卡片显示用户个人信息；为2时，显示别人的信息;
    if (getApp().globalData.cardType=="1"){
      this.setData({
        personIntr: getApp().globalData.personIntr,
        // personCardRight: getApp().globalData.personCardRight,
      })
    } else if (getApp().globalData.cardType == "2"){
      this.setData({
        personIntr: getApp().globalData.otherIntr,
        // personCardRight: getApp().globalData.personCardRight,
      })
    }

    // console.log("子组件的", this.data.personCardRight, "全局的", getApp().globalData.personCardRight);

    // this.data.hero = getApp().globalData.heroes.libai;
    // getApp().globalData.hero = this.data.hero;
    // this.audioCtx = wx.createAudioContext('voice');
    
  },
  /**
   * 组件的方法列表
   */
  methods: {
    
    // like: function () {
    //   if (this.data.heart === "../../images/icon_heart.png") {
    //     this.setData({
    //       heart: "../../images/icon_heart-like.png"
    //     })
    //   } else {
    //     this.setData({
    //       heart: "../../images/icon_heart.png"
    //     })
    //   }
    //   var eventDetail={
    //     modalHidden: true
    //   }
    //   var eventOption={
    //     composed:true
    //   }
    //   this.triggerEvent('modalTap' ,eventDetail, eventOption);
    // },
    edit: function () {
      wx.navigateTo({
        url: '../../pages/editMyCard/editMyCard',
      })
    },
    viocePlay: function () {
      this.audioCtx.play();
    }
  }
})

