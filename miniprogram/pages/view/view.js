const db = wx.cloud.database();

Page({
  data: {
    msg: '', // 填写邀请信息 想说的话
    openid: '', // 用户的openid
    hiddenmodalput: true, // 邀请框是否弹出
    dataobj: {}, // 邀请对象的数据信息
    user: {}, // 用户的数据信息
    time: '', // 用户邀请的时间
    hasInvited: false, // 是否发出了邀请
    done: false, // 页面和数据库是否加载完成了
    wordcount: 0 // 邀请信息的字数
  },
  searchinput(e) {
    this.setData({
      msg: e.detail.value,
      wordcount: e.detail.value.length
    })
  },
  // 点击邀请键
  invite() {
    var user = this.data.user;
    if (user.canedit == true) {
      this.setData({
        hiddenmodalput: false
      })
    }
    else {
      wx.showToast({
        title: "您被禁止权限",
        icon: 'error',
        mask: true
      })
    }
  },

  // 邀请框是否弹出
  modalcancel() {
    this.setData({
      hiddenmodalput: true
    })
  },
  modalconfirm() {
    console.log(this.data.hasInvited);
    this.setData({
      hiddenmodalput: true
    });
    var hasInvited = this.data.hasInvited;
    var user = this.data.user;
    var dataobj = this.data.dataobj;
    var msg = this.data.msg;
    var useropenid = wx.getStorageSync('openid');
    var taopenid = this.data.dataobj._openid;
    var utils = require('../../utils/utils');
    var now = utils.formatTime(new Date());
    this.setData({
      time: now
    });
    if (user.free == false) {
      wx.showToast({
        title: "您不能邀请舞伴",
        icon: 'error',
        mask: true
      })
    }
    else {
      if (dataobj.free == false) {
        wx.showToast({
          title: "Ta不能接受邀请",
          icon: 'error',
          mask: true
        })
      }
      else {
        if (user.hasPartner == true) {
          wx.showToast({
            title: "您已经有舞伴了",
            icon: 'error',
            mask: true
          })
        }
        else if (hasInvited == true) {
          wx.showToast({
            title: "邀请过Ta了",
            icon: 'error',
            mask: true
          })
        }
        else if (user._openid == taopenid) {
          wx.showToast({
            title: "别邀请自己哦",
            icon: 'error',
            mask: true
          })
        }
        else {
          this.setData({
            hasInvited: true
          });
          // 可以邀请，开始往Invitations数据库添加邀请信息
          db.collection('Invitations').add({
            data: {
              senderid: useropenid,
              receiverid: taopenid,
              time: now,
              message: msg,
              sendername: user.name,
              receivername: dataobj.name
            },
            success: function (res) {
              wx.showToast({
                title: "邀请成功",
                icon: 'success',
                mask: true
              });
            }
          })
        }
      }
    }
  },

  // 获得用户的openid
  get_openid() {
    var openid = wx.getStorageSync('openid');
    this.setData({
      done: false
    });

    // 从数据库中获得用户自己的数据
    db.collection('ActiveUser').where({ _openid: openid }).get({
      success: res => {
        var user2 = res.data[0];
        this.setData({
          user: user2
        })
      }
    });

    // 从数据库中找到用户的邀请函
    db.collection('Invitations').where({ senderid: openid, receiverid: this.data.dataobj._openid }).get({
      success: res => {
        console.log(res.data.length);
        if (res.data.length != 0) {
          this.setData({
            hasInvited: true
          })
        }
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
    console.log(options.personid)
    db.collection("ActiveUser").where({ _openid: options.personid }).get({
      success: res => {
        console.log(res.data)
        var dataobj2 = res.data[0];
        console.log(dataobj2._openid)
        this.setData({
          dataobj: dataobj2
        });
        this.get_openid();
      }
    });
  },
})