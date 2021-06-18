//引入 mixin.js,实现 mixin(混入)功能
import "./utils/mixin"
import {
  mixin1
} from "./common/globalMixin"
App({
  onLaunch() {
    wx.getSystemInfo({
      success: (res) => {
        this.globalData.statusBarHeight = res.statusBarHeight
      }
    })
    //版本更新提醒
    const updateManager = wx.getUpdateManager();

    updateManager.onCheckForUpdate(function (res) {
      // 请求完新版本信息的回调
    })

    updateManager.onUpdateReady(function () {
      wx.showModal({
        title: '更新提示',
        content: '新版本已经准备好，是否重启应用？',
        success: function (res) {
          if (res.confirm) {
            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            updateManager.applyUpdate()
          }
        }
      })
    });
    updateManager.onUpdateFailed(() => {
      wx.showToast({
        icon: "error",
        title: "更新版本失败"
      })
    })
  },
  globalData: {
    userInfo: null,
    token: null,
    statusBarHeight: 0,
  },
})

// 全局 mixins(混入)
wx.mixin(mixin1)