// import $ from "jquery";
// import _ from "lodash";
import Backbone from "backbone";

// views

// templates
import orderListItemTpl from "app/client/mall/tpl/list-page/order/order-list-item.tpl";
const OrderListView = Backbone.View.extend({
  tagName: "li",

  className: "record-area js-touch-state touch-bg no-select",

  events: {
    "click .js-to-express": "toExpressInfo",
    "click .js-cancel-order": "cancelOrder",
    "click .js-delete-order": "deleteOrder",
    "click .js-purchase-order": "toPurchase",
    "click .js-to-goods-detail": "toGoodsDetail"
  },

  initialize() {
    this.listenTo(this.model, "destroy", this.remove);
    this.listenTo(this.model, "change:show", this.toggle);
  },

  render() {
    this.model.set({
      rendered: true
    });
    this.$el.html(orderListItemTpl(this.model.toJSON()));
    return this;
  },

  // 取消订单
  cancelOrder() {

  },

  // 删除订单
  deleteOrder() {

  },

  // 去支付
  toPurchase() {

  },

  // 查看物流
  toExpressInfo() {

  },

  // 再次购买
  toGoodsDetail() {

  },

  toggle(model) {
    if(!model.get("show")) {
      this.$el.hide();
    } else {
      this.$el.show();
    }
  }
});

export default OrderListView;
