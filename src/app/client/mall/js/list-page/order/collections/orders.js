import Backbone from "backbone";
import OrderModel from "app/client/mall/js/list-page/order/models/order.js";

var Orders = Backbone.Collection.extend({
  model: OrderModel,

  setOrderType(orderType) {
    this.filter({orderType: -1})
    .forEach((item) => {
      item.set({orderType: orderType});
    });
  },

  hide() {
    this.forEach((item) => {
      item.set({
        show: false
      });
    });
  },

  show() {
    this.forEach((item) => {
      item.set({
        show: true
      });
    });
  }
});

export default Orders;
