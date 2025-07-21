// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  try {
    console.log("hello")
    db.collection("ActiveUser").where({_openid:event.dataobj._openid}).update({
      // data 传入需要局部更新的数据
      data: {
        hasPartner:true,
        partner:event.user.name,
        mypartner:event.user.name
          }
    }),
    db.collection("ActiveUser").where({_openid:event.user._openid}).update({
      // data 传入需要局部更新的数据
      data: {
        hasPartner:true,
        partner:event.dataobj.name,
        mypartner:event.dataobj.name
      }
    });

    // 查询符合条件的 senderid 和 receiverid，并删除对应记录
    const invitations = await db.collection("Invitations").where({
        senderid: event.dataobj._openid,
        receiverid: event.user._openid
    }).get();
    // 判断记录存在
    if (invitations.data.length > 0) {
      const deletePromises = invitations.data.map(invitation => {
        return db.collection("Invitations").doc(invitation._id).remove();
      });
      // 等待所有删除操作完成
      await Promise.all(deletePromises);
    }
    } catch (e) {
    console.error(e)
  }

  return{
    new:"kulu",
    name:event.name,
    senderid:event.senderid
  };
}