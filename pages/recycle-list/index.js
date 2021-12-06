const createRecycleContext = require('miniprogram-recycle-view')
Page({
  data: {
    navConfig: {
      title: "虚拟列表",
      isLeftArrow: true
    },
    recycleList: [],
    isLoading: false,
    deviceWidth: 320,
    itemHeight: 150,
    num: 0
  },
  async onLoad() {
    const deviceWidth = (await wx.getSystemInfo()).screenWidth
    this.setData({
      deviceWidth
    })
  },
  onReady: async function () {
    var ctx = createRecycleContext({
      id: 'recycleId',
      dataKey: 'recycleList',
      page: this,
      itemSize: { // 这个参数也可以直接传下面定义的this.itemSizeFunc函数
        width: this.data.deviceWidth,
        height: this.data.itemHeight
      }
    })
    this.ctx = ctx
    const list = await this.load()
    this.ctx.append(list)
  },
  itemSizeFunc: function (item, idx) {
    return {
      width: 162,
      height: 182
    }
  },
  async scrollLower() {
    const list = await this.load()
    this.ctx.append(list)
  },
  async load() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const list = []
        for (let i = 0; i < 20; i++) {
          this.data.num++
          list.push({
            id: this.data.num,
            title: 'title' + this.data.num
          })
        }
        resolve(list)
      }, 500)
    })
  }
})