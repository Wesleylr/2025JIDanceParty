// 邀请函的页面
Page({
  data: {
    name:'',
    gender:'',
    order:'',
    imageUrl:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 判断用户的性别和名字
    this.setData({
      name:options.name,
      order:options.order
    });
    // console.log(name);
    options.gender=="男";//test
    if(/[\u4e00-\u9fa5]/.test(options.name) == true){
      if(options.gender=="男")
      {
        this.setData({
          imageUrl:"../../icons/invitation_m.jpg"
        })
      }
      else
      {
        this.setData({
          imageUrl:"../../icons/invitation_f.jpg"
        })
      }
    }
    else{
      this.setData({
        imageUrl:"../../icons/invitation_i.jpg"
      })
    }
    
  },

})