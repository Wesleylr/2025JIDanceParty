// 邀请页面
const db = wx.cloud.database();
const _ = db.command;

Page({
  data: {
    openid: '',
    invitation: [],
    dataobj: [{
      Invitation: {},
      Receiver: {}
    }],
    number: 0,
    tempobj: {},
    done: false
  },
  get_openid() {
    this.setData({
      tempobj: {},
      number: 0,
      done: false
    })

    wx.cloud.callFunction({
      name: 'invite_invitation',
      data: {
        senderid: wx.getStorageSync('openid')
      }
    })
      .then(resfindinvitation => {
        console.log(resfindinvitation.result.data);
        this.setData({
          length: resfindinvitation.result.data.length,
          tempobj: resfindinvitation.result.data
        });
        this.process();
      })
      .catch(console.error)
  },



  process() {
    var invitations = this.data.tempobj;
    console.log(invitations);
    var receiverids = [];
    var dataobj = [];
    for (var i = 0; i < invitations.length; i++) {
      receiverids[i] = {
        _openid: invitations[i].receiverid
      }
    }
    console.log(receiverids);
    console.log(invitations);
    if (receiverids.length != 0) {
      db.collection("ActiveUser").where(_.or(receiverids)).get({
        success: res => {
          console.log(res.data);
          var receivers = res.data;
          for (var j = 0; j < receivers.length; j++) {
            for (var k = 0; k < receivers.length; k++) {
              if (receiverids[j]._openid == receivers[k]._openid) {
                dataobj[j] = {
                  Invitation: invitations[j],
                  Receiver: receivers[k]
                };
                break;
              }
            }
          }
          console.log(dataobj);
          this.setData({
            dataobj: dataobj.reverse(),
            done: true,
            number: res.data.length
          });
        }
      })
    }
    else {
      this.setData({
        done: true,
        number: 0
      })
    }
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      done: false
    });
    this.get_openid();
  },
})