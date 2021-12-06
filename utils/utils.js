import {
  CACHE_TOKEN,
  HTTP_OSS_URL
} from "../config"

/**
 * 对Date的扩展，将 Date 转化为指定格式的String
 * 月(Y)、月(m)、日(d)、小时(H)、分(M)、秒(S) 可以用 1-2 个占位符，
 * 例子：
 * dateFormat('YYYY-mm-dd HH:MM:SS', new Date()) ==> 2020-01-01 08:00:00
 */

export const dateFormat = (date = new Date(), fmt = "YYYY-mm-dd") => {
  const opt = {
    "Y+": date.getFullYear().toString(), // 年
    "m+": (date.getMonth() + 1).toString(), // 月
    "d+": date.getDate().toString(), // 日
    "H+": date.getHours().toString(), // 时
    "M+": date.getMinutes().toString(), // 分
    "S+": date.getSeconds().toString() // 秒
    // 有其他格式化字符需求可以继续添加，必须转化成字符串
  };
  let ret
  for (let k in opt) {
    ret = new RegExp("(" + k + ")").exec(fmt)
    if (ret) {
      fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")))
    };
  };
  return fmt
}

// 获取年月日 YYYY-MM-DD
const getDate = (time) => {
  return time.getFullYear() + "-" +
    (time.getMonth() + 1).toString().padStart(2, "0") + "-" +
    time.getDate().toString().padStart(2, "0")
}

// 数组形式返回，今天往后的day后的天
//day 为返回今天往后的天数 
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

// 今天往后的day后的天 ，并格式化 YYYY-MM-DD
const getAfterDate = (day) => {
  let today = new Date();
  let targetday_milliseconds = today.getTime() + 1000 * 60 * 60 * 24 * day;
  today.setTime(targetday_milliseconds); //注意，这行是关键代码
  return getDate(today)
}

// 返回星期几
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

//压缩图片, 老方法，不建议使用。
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
              // 返回压缩后的图片路径
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

// 只接受单张图片上传
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


// 防抖
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
module.exports = {
  dateFormat,
  getDateList,
  getWeekList,
  getDate,
  getAfterDate,
  compressImage,
  upload,
  debounce
}