//自定义小程序页面 page 的 mixin 功能（不同于 behaviors）
const nativePage = Page
const lifecycle = ['onLoad', 'onReady', 'onShow', 'onHide', 'onUnload', 'onPullDownRefresh', 'onReachBottom', 'onShareAppMessage', 'onPageScroll']
let globalMixin = null

//全局mixin方法
wx.mixin = function(config){
  if(isType(config,'object')){
    globalMixin = config
  }
}

//原生Page代理
Page = function (config) {
  let mixins = config.mixins
  //加入全局mixin
  if(globalMixin){                                                         
    (mixins || (mixins=[])).unshift(globalMixin)
  }
  if (isType(mixins, 'array') && mixins.length > 0) {
    Reflect.deleteProperty(config, 'mixins')
    merge(mixins, config)
  }
  nativePage(config)
}

function merge(mixins, config) {
  mixins.forEach(mixin => {
    if (isType(mixin, 'object')) {
      //合并data、生命周期以及其他数据
      Object.keys(mixin).forEach(key => {
        if (key === 'data') {
          config[key] = Object.assign({}, mixin[key], config[key])
        } else if (lifecycle.includes(key)) {
          let nativeLifecycle = config[key]
          config[key] = function () {
            let arg = Array.prototype.slice.call(arguments)
            mixin[key].call(this, arg)
            return nativeLifecycle && nativeLifecycle.call(this, arg)
          }
        } else {
          config[key] = mixin[key]
        }
      })
    }
  })
}

//判断类型工具
function isType(target, type) {
  let targetType = Object.prototype.toString.call(target).slice(8, -1).toLowerCase()
  type = type.toLowerCase()
  return targetType === type
}