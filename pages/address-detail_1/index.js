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
    },
    isShowAreaSelect: false,
    phoneNumberError: "",
    phoneNumbrRegExp: /^(?:(?:\+|00)86)?1[3-9]\d{9}$/
  },

  onLoad: function (options) {
    if (options.address) {
      this.setData({
        formData: JSON.parse(decodeURIComponent(options.address)),
      })
    }
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
    }
  },

  async delAddress() {
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