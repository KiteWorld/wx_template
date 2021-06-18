import {
  CACHE_TOKEN,
  HTTP_OSS_URL
}
from "../config"
import {
  getPayParam,
  getPayId,
  updateAppointmentStatus
} from "../api/service.js"

import Toast from '../miniprogram_npm/@vant/weapp/toast/toast'

const dateFomatter = (time, type = 'date') => {
  let timeText = time.getFullYear() + "-" +
    (time.getMonth() + 1).toString().padStart(2, "0") + "-" +
    time.getDate().toString().padStart(2, "0") + ' ' +
    time.getHours().toString().padStart(2, "0") + ":" +
    time.getMinutes().toString().padStart(2, "0") + ":" +
    time.getSeconds().toString().padStart(2, "0")

  return timeText

}
// 获取当前时间 
const getNowTime = (time) => {
  return time.getFullYear() + "-" +
    (time.getMonth() + 1).toString().padStart(2, "0") + "-" +
    time.getDate().toString().padStart(2, "0") + ' ' +
    time.getHours().toString().padStart(2, "0") + ":"
}
//day为返回今天往后的天数
const getDateList = (day) => {
  let dateList = []
  for (let i = 1; i <= day; i++) {
    let today = new Date();
    let targetday_milliseconds = today.getTime() + 1000 * 60 * 60 * 24 * i;
    today.setTime(targetday_milliseconds); //注意，这行是关键代码
    dateList.push(today.getDate())
  }
  return dateList;
}

const getDate = (day) => {
  let today = new Date();
  let targetday_milliseconds = today.getTime() + 1000 * 60 * 60 * 24 * (day - today.getDate());
  today.setTime(targetday_milliseconds); //注意，这行是关键代码
  const formatDate = today.getFullYear() + "-" +
    (today.getMonth() + 1).toString().padStart(2, "0") + "-" +
    today.getDate().toString().padStart(2, "0")
  return formatDate
}
const getWeekList = (dataList) => {
  const weekEum = {
    0: "日",
    1: "一",
    2: "二",
    3: "三",
    4: "四",
    5: "五",
    6: "六",
  }
  return dataList.map(x => {
    let today = new Date()
    let targetday_milliseconds = today.getTime() + 1000 * 60 * 60 * 24 * (x - today.getDate());
    today.setTime(targetday_milliseconds);
    return weekEum[today.getDay()]
  })
}

//压缩图片
/*
  instance 为当前实例
  canvas  canvas DOM元素实例
  canvsdId canvas-id="xxx"
  url 图片文件本地临时路径
  ratio 压缩比例 0 ~ 1，1表示不压缩
  suffix 图片后缀
 */
const compressImage = async function (instance, canvas, canvasId, url, ratio = 0.8, suffix = 'png') {
  return new Promise((resolve, reject) => {
    wx.getImageInfo({
      src: url,
      success: function (res) {
        var canvasWidth = res.width //图片原始长宽
        var canvasHeight = res.height
        canvasWidth = Math.trunc(res.width * ratio)
        canvasHeight = Math.trunc(res.height * ratio)
        instance.setData({
          cWidth: canvasWidth,
          cHeight: canvasHeight
        })
        // const canvas = wx.createCanvasContext(canvasId, instance)
        canvas.drawImage(res.path, 0, 0, canvasWidth, canvasHeight)
        canvas.draw(false, setTimeout(() => {
          wx.canvasToTempFilePath({
            canvasId: canvasId,
            destWidth: canvasWidth,
            destHeight: canvasHeight,
            fileType: suffix,
            quality: ratio,
            success: function (res) {
              resolve(res.tempFilePath)
            },
            fail: function (res) {
              reject(null)
            }
          }, instance)
        }, 500))
      },
      fail: function (res) {
        console.log(res.errMsg)
      },
    })
  })
}

const upload = async function (file, canvas, canvasId, fileType, success) {
  //只接受 jpg、gif、png 格式的文件,
  const acceptFileType = ['jpg', 'gif', 'png']
  const index = file.url.lastIndexOf('.') + 1
  const suffix = file.url.slice(index)
  if (!acceptFileType.includes(suffix)) {
    this.setData({
      'toastConfig.type': 'text',
      'toastConfig.message': `仅支持上传，${acceptFileType.join('、')}格式的文件`,
    })
    return this.toast.show()
  }
  const fileUrl = await compressImage(this, canvas, canvasId, file.url, 0.8, suffix)
  file.url = fileUrl

  // 图片大于 2M 时压缩
  // if (file.size > 2 * 1024 * 1024) {
  //   console.log("压缩")
  //   console.log(file.url)
  //   const fileUrl = await compressImage(this, canvas, canvasId, file.url, 0.8)
  //   file.url = fileUrl
  //   console.log(file.url)
  // }
  wx.uploadFile({
    url: HTTP_OSS_URL + 'upload',
    filePath: file.url,
    name: 'file',
    formData: {
      fileType: fileType
    },
    header: {
      "X-Access-Token": wx.getStorageSync(CACHE_TOKEN)
    },
    success: (res) => {
      success(res)
    },
  });
}

const WeChatPay = function (appointmentId, success) {
  return new Promise(async (resolve, reject) => {
    wx.showLoading({
      mask: true
    })
    let {
      code,
      message,
      result: payId
    } = await getPayId(appointmentId)
    if (code !== 200) {
      wx.hideLoading()
      wx.showToast({
        icon: "none",
        title: message,
      })
      resolve(false)
      return
    }
    if (payId) {
      let {
        code,
        message,
        result: param
      } = await getPayParam(payId)
      if (code !== 200) {
        wx.hideLoading()
        wx.showToast({
          icon: "none",
          title: message,
        })
        resolve(false)
        return
      }
      param.timeStamp = param.timeStamp + ''
      delete param.appId
      wx.hideLoading()
      let paymentResult = await wx.requestPayment(param)
      if (paymentResult.errMsg !== 'requestPayment:ok') {
        wx.showToast({
          icon: "none",
          title: '支付失败',
        })
        resolve(false)
      } else {
        wx.showLoading({
          title: "订单处理中..."
        })
        let res = await updateAppointmentStatus(appointmentId, 2)
        wx.hideLoading()
        if (res.code === 200) {
          resolve(true)
        }
      }
    }
  })
}
//下载图片
// const downLoadPic = async function (attachments) {
//   let result = []
//   return new Promise((resolve, reject) => {
//     const fileUrl = `${HTTP_OSS_URL}download?fileName=${fileName}&filePath=${filePath}&image=true`
//     wx.downloadFile({
//       url: fileUrl,
//       header: {
//         "X-Access-Token": wx.getStorageSync(CACHE_TOKEN)
//       },
//       success: (res) => {
//         result.push({
//           url: res.tempFilePath
//         })
//       },
//       fail: (msg) => {
//         result.push({
//           url: ""
//         })
//       }
//     })
//   })
// }

// 增加前缘触发功能
const debounce = (fn, wait, immediate = false) => {
  let timer, startTimeStamp = 0;
  let context, args;

  let run = (timerInterval) => {
    timer = setTimeout(() => {
      let now = (new Date()).getTime();
      let interval = now - startTimeStamp
      if (interval < timerInterval) {
        console.log('debounce reset', timerInterval - interval);
        startTimeStamp = now;
        run(wait - interval);
      } else {
        if (!immediate) {
          fn.apply(context, args);
        }
        clearTimeout(timer);
        timer = null;
      }

    }, timerInterval);
  }

  return function () {
    context = this;
    args = arguments;
    let now = (new Date()).getTime();
    startTimeStamp = now;

    if (!timer) {
      console.log('debounce set', wait);
      if (immediate) {
        fn.apply(context, args);
      }
      run(wait);
    }

  }

}
const toastShow = function (data) {
  let param;
  if (!data) {

  }
  if (data === "success") {

  }
  if (data === 'fail') {
    param = {
      type: "fail",
    }
  }

  if (typeof data === 'Object') {

  }
  Toast(data)
}
module.exports = {
  dateFomatter,
  getDateList,
  getWeekList,
  getNowTime,
  getDate,
  compressImage,
  upload,
  WeChatPay,
  debounce
}