const app = getApp()
Page({
  data: {
    //导航栏配置
    navConfig: {
      title: "地址详细",
      isLeftArrow: true
    },
    //表单数据
    formData: {
      contactName: '',
      contactTel: "",
      county: "",
      province: "",
      city: "",
      addressDetail: "",
      houseNumber: "",
    },
    isShowSmartAddress: true,
    isShowAreaSelect: false,
    isSelect: false,
    phoneNumberError: "",
  },

  onLoad: function (options) {
    this.setData({
      formData: JSON.parse(decodeURIComponent(options.address)),
    })
  },

  onReady: function () {
    this.toast = this.selectComponent('.my-toast');
  },

  changeContactName({
    detail
  }) {
    this.setData({
      "formData.contactName": detail,
    })
  },

  changeContactTel({
    detail
  }) {
    const param = {
      "formData.contactTel": detail,
    }
    if (detail.length === 11 && /^(?:(?:\+|00)86)?1[3-9]\d{9}$/.test(detail)) {
      param.phoneNumberError = ""
    }
    this.setData(param)
  },

  changeHouseMumber({
    detail
  }) {
    this.setData({
      "formData.houseNumber": detail,
    })
  },

  showSmartAddress: function () {
    this.setData({
      isShowSmartAddress: !this.data.isShowSmartAddress
    })
  },

  confirmArea: function ({
    detail
  }) {
    this.setData({
      "formData.province": detail[0],
      "formData.city": detail[1],
      "formData.county": detail[2],
    })
  },

  changeAddressDetail({
    detail
  }) {
    this.setData({
      "formData.addressDetail": detail
    })
  },

  getLocation() {
    const {
      longitudeLatitude
    } = this.data.formData
    wx.navigateTo({
      url: '../../pages/map/index?longitudeLatitude=' + (longitudeLatitude || ''),
    })
  },

  insightAddress() {
    const addressObj = app.smart(this.data.smartAddress)
    let {
      name = "",
        phone = "",
        province = "",
        city = "",
        county = "",
        street = "",
        address = ""
    } = addressObj
    this.setData({
      "formData.contactName": name,
      "formData.contactTel": phone,
      "formData.province": province,
      "formData.city": city,
      "formData.county": county,
      "formData.addressDetail": street + address,
    })
  },

  changeSmartAddress(e) {
    this.setData({
      smartAddress: e.detail
    })
  },

  async saveAddress() {
    const formData = this.data.formData
    for (const key in formData) {
      if (formData.hasOwnProperty(key)) {
        if (!formData[key]) {
          wx.showToast({
            icon: "none",
            title: '请填写完整信息',
          })
          return
        }
      }
    }
    if (!(/^(?:(?:\+|00)86)?1[3-9]\d{9}$/.test(formData.contactTel))) {
      wx.showToast({
        icon: "none",
        title: '手机号格式错误',
      })
      this.setData({
        "phoneNumberError": "手机号格式错误"
      })
      return
    }
  },
  async delAddress() {
    this.setData({
      "toastConfig.type": "success",
      "toastConfig.message": "删除成功",
    })
    this.toast.show()
    if (res.code === 200) {
      wx.navigateBack({
        delta: 1,
      })
    }
  },
  showAreaSelect: function () {
    this.selectComponent("#area-select").showAreaSelect();
  },
})