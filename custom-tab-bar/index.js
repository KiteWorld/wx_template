import {
  commomProp
} from "../common/behavior"
Component({
  behaviors: [commomProp],
  properties: {},
  data: {
    selected: 0,
    "list": [{
        "url": "/pages/index/index",
        "icon": "wap-home-o",
        "text": "้ฆ้กต"
      },
      {
        "url": "/pages/my/index",
        "icon": "user-circle-o",
        "text": "ๆ็"
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