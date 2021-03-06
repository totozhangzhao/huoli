import Backbone from "backbone";

const OrderModel = Backbone.Model.extend({
  // idAttribute: "orderid",
  defaults:{
    orderType: -1,          // 1为商城 2 一元夺宝 3 保险 4 优惠券 -1 未设置
    userid: "",
    orderid: "1",
    title: null,
    status: {},             // 状态对象 { code: 1, message:'成功', color: 'red'}
    spec: null,             // 规格
    orderKind: 1,           // 1 普通订单 2 微信送礼订单
    img: null,
    point: 0,               // 积分单价
    ppoint: 0,              // 积分总价
    money: 0,               // 单价
    mtotal: 0,              // 总价
    price: "￥0",           // 价格字符串
    amount: 0,              // 购买个数
    createtime: null,       // 创建事件
    operateType: 0,         // 1: 取消订单, 2: 删除订单, 3: 查看物流
    action: 0,              // 1: 去支付, 2: 再次购买
    show: true,             // true 显示 false 隐藏
    rendered: false         // 是否已经渲染过  前端工具字段
  },

  updateStatus(type) {
    if(type === 2) {
      this.destroy();
    } else {
      let status = this.get("status");
      status.code = 16;
      status.message = "已取消";
      this.set({
        operateType: 2,
        action: 2,
        status: status
      });
    }
  }
});

export default OrderModel;
