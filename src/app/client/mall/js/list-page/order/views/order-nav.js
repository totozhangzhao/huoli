// import $ from "jquery";
// import _ from "lodash";
import Backbone from "backbone";

// templates
import orderNavTpl from "app/client/mall/tpl/list-page/order/order-nav.tpl";
import OrderNavs from "app/client/mall/js/list-page/order/collections/order-nav.js";
const OrderListView = Backbone.View.extend({
  el: "#order-nav",

  events: {

  },

  initialize() {
    const dataList = [
      {
        title: "全部",
        target: "all"
      },
      {
        title: "待支付",
        target: "pending"
      },
      {
        title: "待收货",
        target: "express"
      },
      {
        title: "已完成",
        target: "success"
      }
    ];
    this.orderNavs = new OrderNavs(dataList);
  },

  render(params) {
    this.$el.html(orderNavTpl({
      params,
      dataList:this.orderNavs.toJSON()
    }));
  }
});

export default OrderListView;
