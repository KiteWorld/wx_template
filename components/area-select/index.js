import {
  MAP_KEY
} from "../../config.js" //腾讯位置服务的 Key
var QQMapWX = require('../../utils/qqmap-wx-jssdk.min'); // 引入 SDK 文件
var qqmapsdk; // SDK实例对象
Component({
  properties: {},
  data: {
    isShowAreaSelect: false,
    areaList: {
      // 变量名称是 van-area 规定写死的，不能换！不能换！不能换！
      province_list: {}, //省
      city_list: {}, //市
      county_list: {} //区
    },
    // areaSource: []
  },
  lifetimes: {
    attached() {
      //创建SDK实例
      qqmapsdk = new QQMapWX({
        key: MAP_KEY
      });
      //调用 getCityList 
      qqmapsdk.getCityList({
        success: (res) => { //成功后的回调
          // this.data.areaSource = res.result
          this.setData({
            "areaList.province_list": this.ArrayToObject(res.result[0]),
            "areaList.city_list": this.ArrayToObject(res.result[1]),
            "areaList.county_list": this.ArrayToObject(res.result[2]),
          })
        },
        fail: function (error) {
          console.error(error);
        },
        complete: function (res) {
          console.log(res);
        }
      });
    }
  },
  methods: {
    //确认选择
    confirmArea: function (e) {
      const values = e.detail.values
      //直辖市，需要处理数据，保持省市一致，例如，省：北京市；市：北京市；区：朝阳区
      if (values.some(x => !Boolean(x))) {
        [values[1], values[2]] = [values[0], values[1]];
      }
      const arr = (values.map(x => x.name))
      this.triggerEvent("confirm", arr)
      this.setData({
        isShowAreaSelect: false,
      })
    },

    //关闭省市区选择组件
    closeAreaSelect: function () {
      this.setData({
        isShowAreaSelect: false
      })
    },

    //打开省市区选择组件
    showAreaSelect: function () {
      this.setData({
        isShowAreaSelect: true
      })
    },

    // 格式化省市区数据
    ArrayToObject(arr) {
      const obj = {}
      for (let i = 0; i < arr.length; i++) {
        obj[arr[i].id] = arr[i].fullname
      }
      return obj
    }
  }
})