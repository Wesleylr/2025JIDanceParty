// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
exports.main = async(event, context) => { return event.userInfo; //返回用户信息
}