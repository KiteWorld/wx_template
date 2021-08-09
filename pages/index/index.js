import {
  STATUS
} from "../../common/emun"
import {
  mixin2
} from "../../common/globalMixin"

import {
  authLogin
} from "../../utils/authLogin.js"

Page({
  //局部 mixin
  mixins: [mixin2],
  data: {
    navConfig: {
      title: "page1",
      isLeftArrow: false
    },
    status: "",
    authType: "UserInfo", // 不是 UserInfo 时，显示手机号码授权
    showAuth: true,
    cWidth: 100, //设置canvas宽高，进行压缩
    cHeight: 100,
  },

  onLoad: function (options) {
    console.log("mixin1.title1", this.data.title1)
    console.log("mixin2.title2", this.data.title2)
    console.log("mixin2.title2", this.data.activeColor)
    this.getTitle1()
    this.getTitle2()
    const status = 1
    this.setData({
      status: STATUS[status]
    })
    authLogin(this)
  },
  onReady: function () { },
  onShow: function () {
    //初始化tabbar  
    this.getTabBar().init()
  },

  auth() {
    authLogin(this)
  },

})