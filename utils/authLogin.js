  import {
    CACHE_USERINFO,
    CACHE_TOKEN,
    APP_ID,
    CACHE_CODE,
    CACHE_CODE_TIME,
    CACHE_TOKEN_TIME,
    CODE_EFFECTIVE_TIME,
    TOKEN_EFFECTIVE_TIME,
  } from "../config"

  const {
    login
  } = require("../api/user");

  export function authLogin(instance) {
    const cacheUserInfo = wx.getStorageSync(CACHE_USERINFO)
    let userInfo = cacheUserInfo ? JSON.parse(cacheUserInfo) : {}
    getApp().globalData.userInfo = userInfo

    //有token时，不需要重新登录
    const token = wx.getStorageSync(CACHE_TOKEN)
    const tokenTime = wx.getStorageSync(CACHE_TOKEN_TIME)
    if (token && (tokenTime + TOKEN_EFFECTIVE_TIME > (new Date()).getTime())) {
      return authMain(instance, userInfo)
    }

    // 防止第一次经入小程序时,反复调用 wx.login，超出频率规范
    const code = wx.getStorageSync(CACHE_CODE)
    const codeTime = wx.getStorageSync(CACHE_CODE_TIME)
    if (code && (codeTime + CODE_EFFECTIVE_TIME > (new Date()).getTime())) {
      return authMain(instance, userInfo)
    }
    wx.login({
      success: async (res) => {
        if (res.code) {
          const loginRes = await login(APP_ID, res.code)
          wx.setStorageSync(CACHE_TOKEN, loginRes.result.token)
          wx.setStorageSync(CACHE_TOKEN_TIME, (new Date()).getTime())
          wx.setStorageSync(CACHE_CODE, res.code)
          wx.setStorageSync(CACHE_CODE_TIME, (new Date()).getTime())
          wx.setStorageSync(CACHE_USERINFO, JSON.stringify(loginRes.result))
          const globalData = getApp().globalData
          globalData.userInfo = loginRes.result || {}
          authMain(instance, loginRes.result)
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    })
  }

  async function authMain(instance, loginRes) {
  //判断用户名是否为空，弹出授权窗口
  if (!loginRes.wxNickname) {
    instance.setData({
      authType: "UserInfo",
      isShowAuth: true
    })
    return
  } 
  //判断用户名是否为空，弹出授权窗口
  if (!loginRes.wxMobile) {
      instance.setData({
        authType: "PhoneNumber",
        isShowAuth: true,
      })
      return
  }
    //用户名和手机号码都不为空证明已经授权过了
    //这里可以调用首页需要的 api
  }