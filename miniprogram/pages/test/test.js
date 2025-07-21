// index.js
const app = getApp()
const defaultAvatarUrl = 'https://i.postimg.cc/pdbCXg0d/20230219181927.jpg'
Page({
  data: {
    avatarUrl: defaultAvatarUrl,
    theme: wx.getSystemSetting().theme,
    user_nickname:"",
    avatar_submit:false,
    debug:0
  },
  onLoad() {
    const tasks=[1]
    wx.onThemeChange((result) => {
      this.setData({
        theme: result.theme,
        debug:1
      })
    })
    console.log(tasks.length)
   
  },
  onChooseAvatar(e) {
    const { avatarUrl } = e.detail 
    this.setData({
      avatarUrl,
      avatar_submit:true,
    })
    console.log(this.data.avatarUrl)
    this.setData({
      debug:"status updated choose Avatar"
    })
    wx.cloud.uploadFile({
      cloudPath: "kulu"+".png",
      filePath: avatarUrl, // 文件路径
      success: res => {
        // get resource ID
        console.log(res.fileID)
        this.setData({
          debug:res.fileID
        })
      },
     
      fail: err => {
        // handle error
      }
    })
  },
  formSubmit(e){
      console.log('昵称：',e.detail.value.nickname)
      this.setData({
        user_nickname:e.detail.value.nickname,
      })
      if(this.data.avatar_submit==false)
      {
        wx.showToast({
          title:"头像捏",
          icon:'error',
          mask:true
        })
      }
      else if(this.data.user_nickname=="")
      {
        wx.showToast({
          title:"昵称捏",
          icon:'error',
          mask:true
        })
      }
      else
      {
        wx.showToast({
          title:"提交成功",
          icon:'success',
          mask:true
        })
      }
  }
})
