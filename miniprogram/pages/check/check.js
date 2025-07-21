//这个页面是：在邀请中查看自己发出的邀请时看到的
const db = wx.cloud.database(); // 获得数据库

Page({
  data: {
    openid: '', // 用户的openid
    hiddenmodalput: true, // 弹窗是否隐藏的bool
    dataobj: {}, // 用户邀请对象的数据
    user: {}, // 用户的数据
  },
  invite() {
    this.setData({
      hiddenmodalput: false
    })
  },

  // 点击撤回邀请按钮的回调函数 弹出显示框
  modalcancel() {
    this.setData({
      hiddenmodalput: true
    })
  },
  modalconfirm() {
    this.setData({
      hiddenmodalput: true
    });
    db.collection("Invitations").where({ receiverid: this.data.dataobj._openid }).remove({
      success: res => {
        wx.showToast({
          title: "撤销成功",
          icon: 'success',
          mask: true
        })
        wx.switchTab({
          url: '../invite/invite',
        })
      }
    })
  },

  // 获得用户的openid
  get_openid() {
    // 从数据库中根据openid得到该用户的信息
    db.collection('ActiveUser').where({ _openid: wx.getStorageSync('openid') }).get({
      success: res => {
        console.log(1);
        var user2 = res.data[0];
        this.setData({
          user: user2
        })
      }
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 传入了邀请对象的openid
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
  }
})