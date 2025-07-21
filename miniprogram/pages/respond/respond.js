// 从信箱页面点入邀请函看到的具体的邀请信息
const db = wx.cloud.database();
const _ = db.command;

Page({
  data: {
    openid: '', // 用户的openid
    hiddenmodalput: true, // 弹窗是否显示
    dataobj: {}, // 邀请者的数据信息
    user: {}, // 用户的数据信息
    invitations: {}, // 邀请函
    done: false, // 页面数据库是否加载完成
    taid: '', // 邀请者的openid
  },

  // 接受舞伴
  accept() {
    this.setData({
      hiddenmodalput: false
    })
  },

  // 窗口的弹出
  modalcancel() {
    this.setData({
      hiddenmodalput: true
    })
  },

  // 接受邀请，修改两人的舞伴信息
  modify() {
    wx.cloud.callFunction({
      // 云函数名称
      name: 'modify_partner',
      // 传给云函数的参数
      data: {
        user: this.data.user
        , dataobj: this.data.dataobj
      },
      success: function (res) {
        console.log("cloud function done")
        wx.showToast({
          title: "匹配成功",
          icon: 'success',
          mask: true
        })
      },
      fail: console.error
    });
  },

  // 点击接受舞伴
  modalconfirm() {
    var dataobj = this.data.dataobj;
    var user = this.data.user;
    this.setData({
      hiddenmodalput: true
    });
    if (user.free == false) {
      wx.showToast({
        title: "您不能接受邀请",
        icon: 'error',
        mask: true
      })
    }
    else {
      if (dataobj.free == false) {
        wx.showToast({
          title: "Ta不能拥有舞伴",
          icon: 'error',
          mask: true
        })
      }
      else {
        if (user.hasPartner == false) {
          if (dataobj.hasPartner == false) {
            console.log(this.data.user)
            console.log(this.data.dataobj)
            this.modify()
          }
          else {
            wx.showToast({
              title: "Ta已经有舞伴了",
              icon: 'error',
              mask: true
            })
          }
        }
        else {
          wx.showToast({
            title: "您已经有舞伴了",
            icon: 'error',
            mask: true
          })
        }
      }
    }
  },

  // 获得用户的openid
  get_openid() {
    var openid = wx.getStorageSync('openid');
    this.setData({
      hasPartner: false,
      done: false,
    });

    // 从数据库获得用户的数据信息
    db.collection('ActiveUser').where({ _openid: openid }).get({
      success: res3 => {
        var user2 = res3.data[0];
        this.setData({
          user: user2
        });
        // 根据用户的id找到对应的邀请信息并显示
        db.collection('Invitations').where({ senderid: this.data.dataobj._openid, receiverid: openid }).get({
          success: res2 => {
            // console.log(1);
            this.setData({
              invitations: res2.data[0],
              done: true
            });
            console.log(res2.data[0])
          }
        })
      }
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      taid: options.personid
    });
    db.collection("ActiveUser").where({ _openid: options.personid }).get({
      success: res3 => {
        var dataobj2 = res3.data[0];
        this.setData({
          dataobj: dataobj2
        });
      }
    });
    this.get_openid();
  },

})