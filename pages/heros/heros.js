Page({

  /**
   * 页面的初始数据
   */
  data: {
    hero_job: [{
      name: "战士", 
      list_check: true
    },
    {
      name: "坦克",
      list_check: false
    },
    {
      name: "刺客",
      list_check: false
    },
    {
      name: "法师",
      list_check: false
    },
    {
      name: "射手",
      list_check: false
    },
    {
      name: "辅助",
      list_check: false
    }],
    hero_id:'1',//用hero_id来区别英雄类型
    allheros:[]
  },
  //选择英雄类型
  choosehero:function(e){
    var Index = e.currentTarget.dataset.index;
    var newhero_job = this.data.hero_job;
    for(var i=0;i<newhero_job.length;i++){
       newhero_job[i].list_check=false;
    }
    newhero_job[Index].list_check=true;
    this.setData({
      hero_job: newhero_job,
      hero_id: Index
    })
    //console.log(this.data.hero_id);
  },
  //获取点击的英雄
  selcehero:function(e){
    console.log(e.currentTarget.dataset.index);
    var selectId = e.currentTarget.dataset.index;
    var nowhero = this.data.allheros[this.data.hero_id].hero[selectId];
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2]  //上一个页面
    prevPage.setData({
      lovehero: nowhero
    })
    wx.navigateBack(); 
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this=this;
    wx:wx.request({
      url: 'https://yyq.intech.gdinsight.com/index.php?m=public&a=get_hero',
      header: {'content-type': 'application/json'},
      method: 'GET',
      dataType: 'json',
      success: function(res) {
        console.log(res.data.data);
        _this.setData({
          allheros: res.data.data,
        })
      },
      fail: function(res) {

      },
      complete: function(res) {

      }
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
    
  }
})