// components/authorize/index.js
import {
  CACHE_USERINFO,
} from "../../config"
import {
  updateUserInfo,
  updatePhone
} from "../../api/user"
Component({
  properties: {
    type: {
      type: String,
      value: "UserInfo"
    },
    showAuth: {
      type: Boolean,
      value: false
    },
  },

  data: {
    loading: false,
  },
  /**
   * 组件的方法列表
   */
  lifetimes: {},
  methods: {
    getUserProfile() {
      wx.getUserProfile({
        lang: 'zh_CN',
        desc: "微信授权登录",
        success: async (res) => {
          //传给后端的参数
          let param = {
            encryptedData: {
              encryptedData: res.encryptedData,
              iv: res.iv
            },
            rawData: res.rawData,
            signature: res.signature,
            userInfo: res.userInfo
          }
          //调用更新接口
          let updateRes = await this.update(updateUserInfo, param)
          if (!updateRes) return
          // 弹出手机号码授权窗口
          this.setData({
            showAuth: "PhoneNumber",
            type: true,
          });
        },
        fail(res) {
          console.log(res)
        }
      })
    },
    async getPhoneNumber(e) {
      if (e.detail.errMsg === "getPhoneNumber:ok") {
        //传给后端的参数
        const param = {
          encryptedData: {
            encryptedData: e.detail.encryptedData,
            iv: e.detail.iv
          },
        }
        //调用接口
        let updateRes = await this.update(updatePhone, param)
        if (!updateRes) return
        //关闭隐藏接口
        this.hide()
      }
    },
    onCancel() {
      this.hide()
    },
    hide() {
      this.setData({
        showAuth: false
      })
    },
    //更新用户信息
    async update(updateApi, param) {
      this.setData({
        loading: true
      })
      let updateRes = await updateApi(param)
      this.setData({
        loading: false
      })
      if (updateRes.code !== 200) {
        wx.showToast({
          icon: "error",
          title: "更新失败",
        })
        return false
      }
      //更新本地保存 userInfo 数据
      getApp().globalData.userInfo = updateRes.result || {}
      wx.setStorageSync(CACHE_USERINFO, JSON.stringify(updateRes.result))
      return updateRes
    }
  }
})