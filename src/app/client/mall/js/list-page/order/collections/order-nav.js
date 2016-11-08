import Backbone from "backbone";
import OrderNavModel from "app/client/mall/js/list-page/order/models/order-nav.js";

var OrderNavs = Backbone.Collection.extend({
  model: OrderNavModel
});

export default OrderNavs;
