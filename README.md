微信小程序通用项目模板——「提高效率，~~安心摸鱼~~专注于业务逻辑」

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
│  └─ globalMixin.js            // 页面公用的 mixin(混入)
├─ components                                                      
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
├─ package-lock.json                                               
├─ package.json                                                     
├─ pages                        // 页面（用于演示）
│  ├─ detail                                                       
│  │  ├─ index.js                                                  
│  │  ├─ index.json                                                
│  │  ├─ index.wxml                                                
│  │  └─ index.wxss                                                
│  ├─ page1                                                        
│  │  ├─ index.js                                                  
│  │  ├─ index.json                                                
│  │  ├─ index.wxml                                                
│  │  └─ index.wxss                                                
│  └─ page2                                                        
│     ├─ index.js                                                  
│     ├─ index.json                                                
│     ├─ index.wxml                                                
│     └─ index.wxss                                                
├─ project.config.json          // 项目配置，对应小程序开发者工具，右侧的勾选项
├─ README.md                                                       
├─ sitemap.json                                                    
└─ utils                                                           
   ├─ authLogin.js              // 登录校验逻辑 
   ├─ mixin.js                  // 使小程序页面也具备类似于 vue 的 mixin(混入) 功能
   ├─ request.js                // 请求的统一处理，例如：携带token、token校验、异常处理等
   └─ utils.js                  // 一些公用的工具函数、如果时间格式化、图片压缩等

```

## 项目相关文章：

掘金：
- [微信小程序开发那些事 —— 项目前期准备篇](https://juejin.cn/post/6975434044024553503)
- [微信小程序登录功能的实现以及坑点 —— 前端实现](https://juejin.cn/post/6976455315298451470)

知乎：
- [微信小程序开发那些事 —— 项目前期准备篇](https://zhuanlan.zhihu.com/p/382180744)
- [微信小程序登录功能的实现以及坑点 —— 前端实现](https://zhuanlan.zhihu.com/p/382588175)

