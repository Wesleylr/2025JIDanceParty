// 个人页面
const db = wx.cloud.database();
const _ = db.command;


Page({
  data: {
    openid: '',
    dataobj: {},
    partnerobj: {},
    hasPartner: false,
    done: false,
    invitation: {},
    accept: {},
    invitedone: false,
    acceptdone: false
  },

  edit() {
    var dataobj = this.data.dataobj;
    if (dataobj.canedit == true) {
      wx.navigateTo({
        url: "../edit/edit"
      })
    }
    else {
      wx.showToast({
        title: "您被禁言了",
        icon: 'error',
        mask: true
      })
    }

  },

  get_openid() {
    var openid = wx.getStorageSync('openid');
    db.collection("ActiveUser").where({ _openid: openid }).get({
      success: ress1 => {
        this.setData({
          done: true,
          dataobj: ress1.data[0],
          openid: openid
        });
        var tempobj = ress1.data[0];
        console.log(tempobj)
        console.log(ress1.data[0].hasPartner);
        if (ress1.data[0].hasPartner == true) {
          //在ActiveUser数据中找到自己的舞伴
          db.collection("ActiveUser").where({ name: tempobj.mypartner }).get({
            success: ress2 => {
              console.log(ress2)
              this.setData({
                partnerobj: ress2.data[0]
              })
            }
          })
        }
      }
    })
  },
  //前往邀请函页面
  toinvitation() {
    wx.navigateTo({
      url: "../invitation/invitation?name=" + this.data.dataobj.name + "&gender=" + this.data.dataobj.gender + "&order=" + this.data.dataobj.order
    });
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function (options) {
    this.setData({
      done: false
    });
    this.get_openid();
  },
})