// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  try {
    db.collection("ActiveUser").where({_openid:event.dataobj._openid}).update({
      // data 传入需要局部更新的数据
      data: {
        preference:event.dataobj._preference
          },
    })
  } catch (e) {
    console.error(e)
  }
  return{
    new:"kulu"
    ,name:event.name
    ,senderid:event.senderid
  }
}