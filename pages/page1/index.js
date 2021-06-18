import {
  STATUS
} from "../../common/emun"
import {
  mixin2
} from "../../common/globalMixin"

Page({
  //局部 mixin
  mixins: [mixin2],
  data: {
    navConfig: {
      title: "page1",
      isLeftArrow: false
    },
    status: ""
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
  },
  onReady: function () {},
  onShow: function () {
    //初始化tabbar  
    this.getTabBar().init()
  },
})