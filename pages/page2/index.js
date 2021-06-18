Page({
  data: {
    navConfig: {
      title: "page2",
      isLeftArrow: false
    },
  },
  onLoad: function (options) {},
  onReady: function () {},
  onShow: function () {
    //初始化tabbar  
    this.getTabBar().init()
  },
})