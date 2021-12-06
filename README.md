微信小程序通用项目模板——「提高效率，~~安心摸鱼~~专注于业务逻辑」

模板特点：vant-weapp、自定义导航栏、自定 tabbar、自定义mixin混入、全局样式、请求接口二次封装（request.js）、枚举（emun.js）、toast二次封装（全局调用）、添加地址模板三种方式（省市区联动、地图选点、智能识别）、vant 转换像素单位（px 转 rpx , 需自己转换） 等等

衍生项目项目：[「钉钉小程序通用模板」](https://github.com/KiteWorld/dingding_template)

## 项目启动

- 安装依赖
```
//项目根目录，执行命令
npm i
```
- 构建 npm 包

微信开发者工具 --> 工具 --> 构建 npm 


##  项目目录：

```
wx_template                                                        
├─ api                                                             
│  └─ user.js                   // user 用户相关的 api
├─ app.js                                                          
├─ app.json                     // 小程序全局配置
├─ app.wxss                     // 全局样式
├─ common                                                          
│  ├─ behavior.js               // 组件公用的 behavior 
│  ├─ emun.js                   // 枚举
│  └─ globalMixin.js            // 页面公用的 m1312ixin(混入)
├─ components                                           
│  ├─ area-select               // 地区选择组件
│  │  ├─ index.js      
│  │  ├─ index.json    
│  │  ├─ index.wxml    
│  │  └─ index.wxss            
│  ├─ authorize                 // 用户信息和手机号码授权组件
│  │  ├─ index.js                                                  
│  │  ├─ index.json                                                
│  │  ├─ index.wxml                                                
│  │  ├─ index.wxss                                                
│  │  └─ mixin.js                                                  
│  └─ navbar                    // 顶部导航栏
│     ├─ index.js                                                   
│     ├─ index.json                                                
│     ├─ index.wxml                                                
│     └─ index.wxss                                                
├─ config.js                    // 全局配置
├─ css                                                             
│  └─ variables.wxss            // css 全局变量
├─ custom-tab-bar               // 自定义 tabbar 
│  ├─ index.js                                                     
│  ├─ index.json                                                   
│  ├─ index.wxml                                                   
│  └─ index.wxss                                                   
├─ fonts                                                           
│  └─ iconfont.wxss             // iconfont 字体样式
├─ pages                        // 页面（用于演示）
│  ├─ index
│  ├─ map
│  ├─ index 
│  ├─ address-detail_1                                                 
│  ├─ address-detail_2                                                 
│  ├─ address-detail_3                                                 
├─ project.config.json          // 项目配置，对应小程序开发者工具，右侧的勾选项
├─ sitemap.json              
├─ gulpfile.json                // gulpfile gulp的配置文件，用于搭配 postcss-pxtransform 转换 vant 像素单位                    
└─ utils
   ├─ smartWeChat               // 智能识别地址                                                       
   ├─ authLogin.js              // 登录校验逻辑 
   ├─ app.js                    // app 相关的工具类，例如 toast 二次封装。  
   ├─ mixin.js                  // 使小程序页面也具备类似于 vue 的 mixin(混入) 功能
   ├─ request.js                // 请求的统一处理，例如：携带token、token校验、异常处理等
   ├─ qqmap-wx-jssdk.min.js     // 腾讯地图 sdk
   ├─ smartWeChat               // 地址只能识别插件            
   └─ utils.js                  // 一些公用的工具函数、如果时间格式化、图片压缩等
```

## vant-weapp 转换像素单位 （px 转 rpx）
假设你已经安装了`vant-weapp`, 并且已经 `npm 构建`，如果构建失败可以参考 —— [「微信官网」](https://developers.weixin.qq.com/miniprogram/dev/devtools/npm.html)
### 安装依赖
```
npm i  gulp gulp-postcss postcss-pxtransform -D
```
### 创建 gulp 配置信息 
根目录里面已经创建好了 `gulpfile.js`，不用新建，但是有个地方需要注意，看清楚 `vant-weapp` 构建后的路径是否正确，如果不正确改成自己的就好
```
  //根据自己的 vant 构建路径来
  return gulp.src(['miniprogram_npm/@vant/weapp/**/*.wxss']) 
    .pipe(postcss(processors))
    .pipe(gulp.dest('miniprogram_npm/@vant/weapp/'));
```
### 修改 node_modules/postcss-pxtransform/index.js 
```
// 默认设置 deviceRatio
// const  deviceRatio = {
//   640: 2.34 / 2,
//   750: 1,
//   828: 1.81 / 2
// }

const deviceRatio = {
  640: 2.34,
  750: 2,
  828: 1.81
}
```

### 添加 npm 脚本，并运行
``` 
// package.json（已配置）
scripts": {
    "build": "gulp css",
  },
```
```
// 运行 npm 脚本
npm run build
```

## 项目相关文章：

掘金：
- [微信小程序开发那些事 —— 项目前期准备篇](https://juejin.cn/post/6975434044024553503)
- [微信小程序登录功能的实现以及坑点 —— 前端实现](https://juejin.cn/post/6976455315298451470)
- [微信小程序添加地址的三种实现方式 —— 省市区联动选择器、地图选点、智能识别地址](https://juejin.cn/post/6979432031961022478)

知乎：
- [微信小程序开发那些事 —— 项目前期准备篇](https://zhuanlan.zhihu.com/p/382180744)
- [微信小程序登录功能的实现以及坑点 —— 前端实现](https://zhuanlan.zhihu.com/p/382588175)
- [微信小程序添加地址的三种实现方式 —— 省市区联动选择器、地图选点、智能识别地址](https://zhuanlan.zhihu.com/p/385354223)

