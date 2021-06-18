import {
  commomProp
} from "../common/behavior"
Component({
  behaviors: [commomProp],
  properties: {},
  data: {
    selected: 0,
    "list": [{
        "url": "/pages/page1/index",
        "icon": "wap-home-o",
        "text": "首页"
      },
      {
        "url": "/pages/page2/index",
        "icon": "user-circle-o",
        "text": "我的"
      }
    ],
  },
  lifetimes: {},
  methods: {
    onChange(e) {
      const url = this.data.list[e.detail].url
      wx.switchTab({
        url: url
      });
      this.setData({
        selected: e.detail
      });
    },
    init() {
      const page = getCurrentPages().pop();
      this.setData({
        selected: this.data.list.findIndex(item => item.url === `/${page.route}`)
      });
    }
  }
})