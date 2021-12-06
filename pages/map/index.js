    import {
      MAP_KEY
    } from "../../config"
    const citySelector = requirePlugin('citySelector');
    import QQMapWX from "../../utils/qqmap-wx-jssdk.min.js"
    let qqmapsdk;
    Page({
      data: {
        navConfig: {
          title: "地图选点",
          isLeftArrow: true
        },
        cityName: "佛山市",
        latitude: '',
        longitude: '',
        centerData: {},
        nearList: [],
        selectedId: 0,
        defaultKeyword: '房产小区',
        keyword: '',
        pageIndex: 1,
        pageSize: 20,
        isDone: false,
        MAP_KEY,
      },

      onLoad: async function (options) {
        //获取地图 map 实例
        this.mapCtx = wx.createMapContext('myMap')
        // 实例化API核心类
        qqmapsdk = new QQMapWX({
          key: MAP_KEY
        });
        //判断是否授权定位
        let scopeRes = await wx.getSetting()
        if (!scopeRes.authSetting['scope.userLocation']) {
          try {
            // 没有授权的时候弹出授权窗口
            await wx.authorize({
              scope: 'scope.userLocation',
            })
          } catch (error) {
            // 用户手动关闭的授权，无法自动调起授权窗口，我们只能提示引导用户授权
            wx.showModal({
              showCancel: false,
              title: '位置授权',
              content: '该功能，需要进行「位置授权」才能使用。可点击「右上角」-->「设置」-->「位置消息」-->「仅在使用小程序使用」'
            })
            return
          }
        }
        wx.showLoading({
          title: '加载中'
        });

        //判断表单是否传了经纬度，如果有则使用表单的，用于在地图里显示刚才选择的位置
        const longitudeLatitude = options ? options.longitudeLatitude : ""
        if (longitudeLatitude) {
          const longLatArr = longitudeLatitude.split(',')
          this.initLocation(longLatArr[1], longLatArr[0])
        } else {
          //微信作死！新版本 wx.getLocation 存在调用频率限制， 使用 onLocationChange 来代替
          wx.startLocationUpdate({
            success: (res) => {
              wx.onLocationChange((location) => {
                if (location) {
                  const {
                    latitude,
                    longitude
                  } = location
                  wx.stopLocationUpdate()
                  this.setData({
                    latitude,
                    longitude
                  })
                  this.initLocation(latitude, longitude)
                }
              })
            },
          })
        }
      },

      onShow: function () {
        //城市选择插件，获取城市信息
        const selectedCity = citySelector.getCity();
        if (selectedCity) {
          const {
            fullname,
            location
          } = selectedCity
          this.setData({
            longitude: location.longitude,
            latitude: location.latitude,
            cityName: fullname
          })
          this.data.pageIndex = 1
          this.data.isDone = false
          this.nearBySearch()
        }

      },
      onUnload() {
        // 页面卸载时清空插件数据，防止再次进入页面，getCity返回的是上次的结果
        citySelector.clearCity();
      },

      toSelectCity() {
        const key = MAP_KEY; // 使用在腾讯位置服务申请的key
        const referer = '微信模板'; // 调用插件的app的名称
        wx.navigateTo({
          url: `plugin://citySelector/index?key=${key}&referer=${referer}`,
        })
      },

      //监听拖动地图，拖动结束根据中心点更新页面
      mapChange: function (e) {
        if (e.type == 'end' && (e.causedBy == 'scale' || e.causedBy == 'drag')) {
          this.mapCtx.getCenterLocation({
            success: (res) => {
              this.setData({
                nearList: [],
                latitude: res.latitude,
                longitude: res.longitude,
              })
              this.data.pageIndex = 1
              this.data.isDone = false
              this.nearBySearch.call(this);
            }
          })
        }

      },

      // 重置
      reload: function () {
        this.setData({
          nearList: []
        })
        this.onLoad();
      },

      chooseCenter: function (e) {
        let id = e.currentTarget.id;
        for (let i = 0; i < this.data.nearList.length; i++) {
          if (i == id) {
            this.setData({
              selectedId: id,
              centerData: this.data.nearList[i],
              latitude: this.data.nearList[i].latitude,
              longitude: this.data.nearList[i].longitude,
            });
            this.selectedOk()
            return;
          }
        }
      },

      nearBySearch: function (e) {
        if (e) {
          this.setData({
            keyword: e.detail,
            pageIndex: 1,
            nearList: [],
            addressInput: e.detail
          })
        }
        wx.hideLoading();
        wx.showLoading({
          title: '加载中'
        });
        qqmapsdk.search({
          keyword: this.data.keyword,
          location: this.data.latitude + ',' + this.data.longitude,
          page_size: this.data.pageSize,
          page_index: this.data.pageIndex,
          success: (res) => {
            wx.hideLoading();
            let sug = [];
            for (let i = 0; i < res.data.length; i++) {
              sug.push({
                title: res.data[i].title,
                id: res.data[i].id,
                addr: res.data[i].address,
                province: res.data[i].ad_info.province,
                city: res.data[i].ad_info.city,
                district: res.data[i].ad_info.district,
                latitude: res.data[i].location.lat,
                longitude: res.data[i].location.lng
              });
            }
            let pageIndex = this.data.pageIndex + 1
            if (sug.length < this.data.pageSize) {
              this.data.isDone = true
              pageIndex = this.data.pageIndex
            };
            this.setData({
              selectedId: 0,
              centerData: sug[0],
              nearList: this.data.nearList.concat(sug),
              pageIndex: pageIndex
            })
          },
          complete: function (res) {
            wx.hideLoading();
          }
        });
      },
      //确认选择地址
      selectedOk: function () {
        let pages = getCurrentPages();
        //获取上一个页面的实例
        let prevPage = pages[pages.length - 2];
        const {
          title,
          city,
          district,
          province,
          latitude,
          longitude
        } = this.data.centerData
        prevPage.setData({
          "formData.county": district,
          "formData.province": province,
          "formData.city": city,
          "formData.addressDetail": title,
          "formData.longitudeLatitude": longitude + ',' + latitude,
        })
        wx.navigateBack({
          delta: 1
        })
      },

      //初始化
      initLocation: function (latitude, longitude) {
        qqmapsdk.reverseGeocoder({
          location: {
            latitude,
            longitude
          },
          get_poi: 1,
          success: (res) => {
            this.setData({
              latitude: latitude,
              longitude: longitude,
              keyword: this.data.defaultKeyword,
              cityName: res.result.address_component.city,
              pageIndex: 1,
              addressInput: ""
            })
            this.nearBySearch();
          },
        });
      },
      loadLocation() {
        if (!this.data.isDone) this.nearBySearch();
      }
    })