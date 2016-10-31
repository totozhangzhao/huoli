import Backbone from "backbone";
import OrderModel from "app/client/mall/js/list-page/order/models/order.js";

var Orders = Backbone.Collection.extend({
  model: OrderModel,

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
