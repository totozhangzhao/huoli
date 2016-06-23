import Backbone from "backbone";

// addressid: 地址id
// userid: 用户id
// postcode: 邮编
// province: 省份
// city: 城市
// area: 区/县
// phone: 电话
// address: 地址
// name:姓名
// hbuserid:航班用户id
const Address = Backbone.Model.extend({
  defaults: {
    addressid: "",
    postcode: "",
    province: "",
    city: "",
    area: "",
    address: "",
    name: "",
    phone: ""
  },
  idAttribute: "addressid"
});

export default Address;
