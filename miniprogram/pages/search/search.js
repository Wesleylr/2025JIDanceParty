// 在首页点入搜索页面
const db = wx.cloud.database();//初始化数据库
Page({
  data: {
   searchVal: "", // 输入的搜索信息
   dataobj:[], // 搜索到的对象
   hasSearched:false // 是否点击了搜索键
  },
  searchinput(e){
    this.setData({
      searchVal:e.detail.value
    })
  },
  search(){
    db.collection('ActiveUser').where({
      name: db.RegExp({
        regexp: this.data.searchVal,//做为关键字进行匹配
        options: 'i',//不区分大小写
      })
    })
    .get({
      success:res=>{
        console.log(res.data);
        this.setData({
          dataobj:res.data,
          hasSearched:true
        })
        console.log(this.data.dataobj);
      }
    })
  }
})