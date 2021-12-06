/* 
 type toast 类型
 content 提示文本
 duration 提示持续时长，默认 1秒
 opt　支持 showToast 中所以属性，注意:相同属性名会覆盖，opt 属性的优先级最高，基本只有需要回调的时候用到
*/
export function toast(icon, title, duration, opt = {}) {
  wx.showToast({
    title: title,
    icon: icon,
    duration: duration || 1000,
    ...opt
  })
}
["success", "error", "loading", "none"].forEach(type => toast[type] = (title, duration, opt) => toast(type, title,
  duration, opt))