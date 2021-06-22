## 微信小程序登录功能的实现以及坑点 —— 前端实现

前两天发了一篇关于微信小程序项目开发前准备的文章，没什么人看。辛辛苦苦码了三千字，我太难了。也罢，自己达到复盘的效果就好

刚兴趣的朋友可以看一下：https://zhuanlan.zhihu.com/p/382180744

废话少讲，干！就完事。

小程序中，同一个用户只有一个 openid ，且不变的。所以往数据库里添加一个用户，要带上openId，这个就是用户的唯一标识。至于怎么把用户的昵称、头像储存下来，后端弄一个更新用户信息的API就好了。

大致登录流程:

- 前端调用 wx.login 获取 code 

- 调用登录接口，把 code 传给后端，后端用 appid + app_secret + code 取到 openid 和 session_key ,并根据 openid 创建一个用户并生成一个 token ，把用户信息和token，一并返回给前端。前端存储起来
- 前端判断用户名、手机是否为空，接着调用更新用户信息的接口 ，后端把信息存入数据库

文档：[小程序登录 | 微信开放文档](https://link.zhihu.com/?target=https%3A//developers.weixin.qq.com/miniprogram/dev/framework/open-ability/login.html)

先看一下前端实现的流程图。
![微信登录流程](D:\Google Downlodas\微信登录流程.jpg)

代码实现：

首先把处理登录逻辑都放在`authLogin.js`，接着自定义一个授权登录的组件——`authorize` 方便多次调用。

`注意：文中调用的接口，需要后端实现。根据实际情况进行调整`

`authLogin.js` —— 处理登录逻辑

```javascript
import {
  CACHE_USERINFO, //storge储存，用户信息的 Key
  APP_ID,
  CACHE_CODE, //storge储存，code 的 Key
  CACHE_TOKEN, //storge储存，token 的 Key
  CACHE_CODE_TIME, //storge储存，获取到 code 的时间戳的 Key
  CACHE_TOKEN_TIME, //storge储存，获取到 token 的时间戳的 Key
  CODE_EFFECTIVE_TIME, //storge储存，code有效时间 Key
  TOKEN_EFFECTIVE_TIME, //storge储存，token有效时间 Key
} from "../config"

//登录接口
const {
  login
} = require("../api/user");
// instance 为当前页面的实例
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

  // 防止第一次经入小程序时,反复调用 wx.login，超出频率规范 ,code 有效期为 5 分钟。推荐 CODE_EFFECTIVE_TIME 值为 4 ~ 4.5分钟
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
  //判断用户名是否为空，弹出用户授权窗口
  if (!loginRes.wxNickname) {
    instance.setData({
      authType: "UserInfo",
      isShowAuth: true
    })
    return
  } 
  //判断用户名是否为空，弹出手机号码授权窗口
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
```



`authorize` 组件—— 用户信息授权、手机用户授权的自定义组件

```javascript
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
```

```html
<!-- components/authorize/index.wxml -->
<van-dialog use-slot show="{{ showAuth }}" showConfirmButton="{{false}}" zIndex="99999">
  <view class="tips-content flex_c_hv">
    <van-button plain icon="wechat" type="primary" custom-class="auth-btn" loading="{{loading}}"
      bind:click="getUserProfile" wx:if="{{type==='UserInfo'}}">
      微信授权登录
    </van-button>
    <van-button plain icon="phone-o" type="info" custom-class="auth-btn" loading="{{loading}}"
      open-type="getPhoneNumber" bind:getphonenumber="getPhoneNumber" wx:else>获取手机号进行绑定
    </van-button>
    <van-button plain custom-class="auth-btn" bind:click="onCancel">取消
    </van-button>
  </view>
  <view class="tips">用户信息仅用于同步售后产品信息</view>
</van-dialog>
```

组件和处理逻辑都准备好之后，就是怎么使用了。你需要在某个页面使用，就把它们引入就好

```javascript
//index.js
import { authLogin } from "../../utils/authLogin.js"
Page({
    data:{
     authType: "getPhoneNumber", // "UserInfo" 为用户基本信息授权、"getPhoneNumber" 为手机号码授权
     showAuth: true
    },
    onLond(){
       //在需要登录校验的地方调用 authLogin
       authLogin(this)
    },
    auth(){
      authLogin(this)
    }
})

//index.json
 "usingComponents": 
   "authorize": "/components/authorize/index"
 }
 
//index.wxml
<van-button bind:click="auth">点击授权登录</van-button>
<authorize type="{{authType}}" showAuth="{{showAuth}}" />

```



坑点一：个人小程序无法获取手机号码，且需要认证的小程序才能获取

坑点二：小程序 wx.login 、wx.getUserProfile等接口，存在调用频率的限制。使用时，需要注意。相关文档：https://developers.weixin.qq.com/miniprogram/dev/framework/performance/api-frequency.html#%E9%A2%91%E7%8E%87%E8%A7%84%E8%8C%83

坑点三： 2021年4月28日起 无法通过`wx.getUserInfo`直接获取到用户个人信息，可以使用`getUserProfile`代替。相关文档：https://developers.weixin.qq.com/community/develop/doc/000cacfa20ce88df04cb468bc52801

坑点四：授权登录的窗口必须要可以关闭，不能强制用户授权。否则无法过审

代码demo：[wx_template](https://github.com/KiteWorld/wx_template)





