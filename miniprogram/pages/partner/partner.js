// 点击个人页面，可以点开自己的舞伴，看看舞伴的信息
const db = wx.cloud.database();

Page({
  data: {
    openid: '', // 用户的openid
    hiddenmodalput: true, // 弹窗是否显示
    dataobj: {}, // 舞伴的数据
    user: {}, // 用户的数据
    done: false // 页面和数据是否加载完成
  },

  // 一个回调函数
  invite() {
    this.setData({
      hiddenmodalput: false
    })
  },

  // 弹窗弹出
  modalcancel() {
    this.setData({
      hiddenmodalput: true
    })
  },
  modalconfirm() {
    this.setData({
      hiddenmodalput: true
    });
    this.delete();
    ;
  },

  // 解除舞伴
  delete() {
    //console.log(this.data.dataobj);
    wx.cloud.callFunction({
      // 云函数名称
      name: 'delete_partner',
      // 传给云函数的参数
      data: {
        user: this.data.user
        , dataobj: this.data.dataobj
      },
      success: function (res) {
        console.log("cloud function done") // hello world !!!
        wx.showToast({
          title: "解除成功",
          icon: 'success',
          mask: true
        })
      },
      fail: console.error
    });
  },

  // 获得用户的openid
  get_openid() {
    var openid = wx.getStorageSync('openid');
    this.setData({
      done: false
    });
    // 在数据库里找到用户的数据
    db.collection('ActiveUser').where({ _openid: openid }).get({
      success: res => {
        var user2 = res.data[0];
        this.setData({
          user: user2
        })
      }
    });

    // 找到invitation
    db.collection('Invitations').where({ senderid: openid, receiverid: this.data.dataobj._openid }).get({
      success: res => {
        console.log(res.data.length);
        this.setData({
          done: true
        });
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    db.collection("ActiveUser").where({ _openid: options.personid }).get({
      success: res => {
        var dataobj2 = res.data[0];
        this.setData({
          dataobj: dataobj2
        })
      }
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.get_openid();
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