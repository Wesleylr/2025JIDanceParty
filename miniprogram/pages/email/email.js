// 这个页面是点击信箱进入的页面，可以看到用户收到的邀请
const db = wx.cloud.database(); // 获得数据库 
const _ = db.command; // 数据库的一个命令

Page({
  data: {
    openid: '', // 用户的openid
    number: 0, // 收到的邀请的数量
    dataobj: [],// 每个加工后邀请的信息
    tempobj: [], // 所有发给自己的邀请
    done: false, // 页面和数据库是否已经加载完成
  },

  // 获得用户的openid
  get_openid() {
    this.setData({
      number: 0,
      datatemp: [],
      dataobj: []
    });

    this.setData({
      done: false,
      number: 0,
    });

    wx.cloud.callFunction({
      name: 'email_invitation',
      data: {
        receiverid: wx.getStorageSync('openid')
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

  // 加工每个邀请的信息
  process() {
    var invitations = this.data.tempobj;
    console.log(invitations);
    var acceptids = [];
    var dataobj = [];
    for (var i = 0; i < invitations.length; i++) {
      acceptids[i] = {
        _openid: invitations[i].senderid
      }
    }
    console.log(acceptids);
    console.log(invitations);
    if (acceptids.length != 0) {
      db.collection("ActiveUser").where(_.or(acceptids)).get({
        success: res => {
          console.log(res.data);
          var senders = res.data;
          for (var j = 0; j < senders.length; j++) {
            for (var k = 0; k < senders.length; k++) {
              if (acceptids[j]._openid == senders[k]._openid) {
                dataobj[j] = {
                  Invitation: invitations[j],
                  Sender: senders[k]
                };
                break;
              }
            }
          }
          console.log(dataobj);
          console.log(100);
          this.setData({
            dataobj: dataobj.reverse(),
            done: true,
            number: res.data.length
          });
        }
      })
    }
    else {
      console.log(200);
      this.setData({
        done: true,
        number: 0
      })
    }
  },
  // 在显示该页面时先调用
  onShow: function () {
    this.setData({
      done: false
    });
    this.get_openid();

  },
})