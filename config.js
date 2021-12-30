// "release" 正式版  "trial" 体验版 "develop" 开发版 
const env = wx.getAccountInfoSync().miniProgram.envVersion

const HTTP_REQUEST_URL = env === "release" ? "https://kite1874.com/api/" : env === "trial" ? "https://kite1874.com/test/api/" : "https://kite1874.com/dev/api/"

module.exports = {
  //请求接口地址，根URL
  HTTP_REQUEST_URL,

  // 腾讯位置服务 Key
  MAP_KEY: "VP4BZ-MPBCU-LQFVU-BXR22-CFNTS-WLFZN",

  // 请求头
  HEADER: {
    'content-type': 'application/json'
  },
  // 回话密钥名称 
  TOKENNAME: 'X-Access-Token',
  //用户信息缓存名称
  CACHE_USERINFO: 'USERINFO',
  //code
  CACHE_CODE: "CODE",
  //code获取时间戳
  CACHE_CODE_TIME: "CODETIME",
  //微信官方称code有效时间为五分钟，保险起见设置 4.5 分钟
  CODE_EFFECTIVE_TIME: 45000,
  //token缓存名称
  CACHE_TOKEN: 'TOKEN',
  //token获取时间戳
  CACHE_TOKEN_TIME: 'CACHE_TOKEN_TIME',
  //token有效时间
  TOKEN_EFFECTIVE_TIME: 82800000,
}