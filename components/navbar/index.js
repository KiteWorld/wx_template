Component({
  //my-navbar 和 my-navbar-title 对应 van-navbar 的 custom-class 和 title-class
  // externalClasses: ['my-navbar', 'my-navbar-title'],
  properties: {
    navConfig: {
      type: Object,
      observer(newVal) {
        if (this.data.navConfig.onClickLeft) {
          this.onClickLeft = this.data.navConfig.onClickLeft
        }
        if (this.data.navConfig.onClickRight) {
          this.onClickRight = this.data.navConfig.onClickRight
        }

      }
    },
    addHeight: {
      type: Number,
      value: 0
    }
  },
  data: {
    navH: 0
  },
  options: {
    styleIsolation: 'shared'
  },
  lifetimes: {
    attached: function () {
      this.setData({
        navH: getApp().globalData.statusBarHeight
      })
    },
    ready: function () {},
  },
  /**
   * 组件的方法列表
   */
  methods: {
    onClickLeft() {
      const navParam = {}
      if (this.data.navConfig.isNavUrl) {
        navParam.url = this.data.navConfig.url
        wx.navigateTo(navParam)
      } else {
        if (getCurrentPages().length <= 1) {
          console.log("已经没有上一页")
          return
        }
        navParam.detal = this.data.navConfig.detal || 1
        wx.navigateBack(navParam)
      }
    },
    onClickRight() {

    }
  }
})