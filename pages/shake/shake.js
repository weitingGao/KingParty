Page({
    data:{
        flag:true,
        shakeDta:{},
        isShow:false,
    },
    onLoad:function(){
      this.setData({
        flag:getApp().globalData.flag,
        isShow: true
      })
      var that=this;
      var flagX = false, flagY = false, flagZ=false;
      var isShaked = 0;
      wx.onAccelerometerChange(function (res) {
        if (isShaked) return;//关闭监听有延迟，需要设置个参数判断
        var x = res.x.toFixed(4),
          y = res.y.toFixed(4),
          z = res.z.toFixed(4);
        flagX = that.getDelFlag(x, that.data.shakeDta.x);
        flagY = that.getDelFlag(y, that.data.shakeDta.y);
        flagZ = that.getDelFlag(z, that.data.shakeDta.z);
        that.setData({
          'shakeDta.x': res.x.toFixed(4),
          'shakeDta.y': res.y.toFixed(4),
          'shakeDta.z': res.z.toFixed(4),
        })
        console.log("yaoyaoyao", flagX, flagY, flagZ);
        if (flagX && flagY || flagX && flagZ || flagY && flagZ) {
          isShaked = 1;
          wx.stopAccelerometer({success:function(){
            wx.vibrateLong({
              success: function (e) {
                wx.redirectTo({
                  url: '../shakeResult/shakeResult',
                })
              }
            })
          }});
        }
      })
      
    },
    selectGodness:function(){
      this.setData({
        flag:true
      })
      getApp().globalData.flag=this.data.flag;
    },
    selectDriver:function(){
      this.setData({
        flag:false
      })
      getApp().globalData.flag = this.data.flag;
    },
    //摇一摇跳转实现
    // isShow: true,//判断是否在本页面
    onShow: function () {
      // var that = this;
      // console.log("1111", that.data.isShow);
      // if (!that.data.isShow) {
      //   wx.stopAccelerometer();
      //   return
      // }else{       
      //   wx.startAccelerometer();
      // }      
    },
    //计算摇一摇偏移量
    getDelFlag:function(val1,val2){
      return(Math.abs(val1-val2)>=1);
    },
    onHide: function(){
      this.setData({
        isShow:false
      });//离开本页面，设为false，不能摇一摇（当小程序后台运行或跳转到其他页面时触发）
      wx.stopAccelerometer();
      console.log(this.data.isShow);
    },
    onUnload:function(){
      this.setData({
        isShow: false
      });//与上面一致，区别是当使用重定向方法wx.redirectTo(OBJECT)或关闭当前页返回上一页wx.navigateBack()触发
      wx.stopAccelerometer();
      console.log(this.data.isShow);
    },
    goMatching:function(){
      wx.redirectTo({
        url: '../shakeResult/shakeResult',
      })
    }
})
