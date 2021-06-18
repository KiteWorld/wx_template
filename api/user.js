import request from "../utils/request"

//这些接口都不是真实的，只是演示怎么使用
//小程序用户登录
export function login(code, data) {
  return request.post(`login?code=${code}`, data, {
    noAuth: true
  });
}
//获取小程序配置信息
export function getAppID(appid, data = {}) {
  return request.post(`infos/${appid}`, data);
}

//更新用户信息
export function updateUserInfo(data) {
  return request.post("user/profile", data);
}

//更新用户手机号
export function updatePhone(data) {
  return request.post("user/phone", data);
}