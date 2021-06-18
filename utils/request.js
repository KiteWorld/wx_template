import {
  HEADER,
  TOKENNAME,
  CACHE_TOKEN,
  HTTP_REQUEST_URL,
} from './../config.js';

export default function request(api, method, data, {
  noAuth = false,
  customHeader = null,
  baseURL = ''
}) {
  let header = customHeader || HEADER;
  const token = wx.getStorageSync(CACHE_TOKEN)
  if (!noAuth && token) header[TOKENNAME] = token
  return new Promise((reslove, reject) => {
    wx.request({
      url: (baseURL || HTTP_REQUEST_URL) + api,
      method: method || 'GET',
      header: header,
      data: data || {},
      success: (res) => {
        if (res.code === 401) {
          wx.removeStorageSync(CACHE_TOKEN)
          wx.showToast({
            title: 'token 已过期,重新加载',
          })
          wx.switchTab({
            url: '/pages/index/index',
          })
          return
        }
        reslove(res.data || null)
      },
      fail: (msg) => {
        wx.hideLoading()
        wx.showToast({
          icon: "none",
          title: "请求失败，服务器异常"
        })
        reject(null);
      }
    })
  });
}

['options', 'get', 'post', 'put', 'head', 'delete', 'trace', 'connect'].forEach((method) => {
  request[method] = (api, data, opt) => request(api, method, data, opt || {})
});