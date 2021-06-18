module.exports = {
  //开发环境
  HTTP_REQUEST_URL: 'https://ass.jceee.com/aftersale/api/mp/',
  //测试环境
  HTTP_REQUEST_URL: 'https://cssuat.lh-home.com.cn/aftersale/api/mp/',


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