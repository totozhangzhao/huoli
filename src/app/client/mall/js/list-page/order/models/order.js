import Backbone from "backbone";

const OrderModel = Backbone.Model.extend({
  defaults:{
    userid: "",
    orderid: "",
    type: 1,
    paytype: 2,
    title: null,
    status: null,
    spec: null,
    color: null,
    deleteFlag: 1,
    img: null,
    mtotal: 0,
    price: "￥0",
    ptotal: 0,
    createtime: null
  }
});


export default OrderModel;
