import Backbone from "backbone";
import OrderModel from "app/client/mall/js/list-page/order/models/order.js";

var Orders = Backbone.Collection.extend({
  model: OrderModel
});

export default Orders;
