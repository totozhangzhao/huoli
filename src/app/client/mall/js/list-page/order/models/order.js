import Backbone from "backbone";

const OrderModel = Backbone.Model.extend({
  id: "orderid",
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
    createtime: null,
    operateType: 0, // 1: 取消订单, 2: 删除订单, 3: 查看物流
    action: 0, // 1: 去支付, 2: 再次购买
    rendered: false,  // 是否已经渲染过
    filterType: null, // 属于哪个筛选条件
  }
});


export default OrderModel;
