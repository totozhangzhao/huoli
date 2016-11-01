// import $ from "jquery";
// import _ from "lodash";
import Backbone from "backbone";
import * as widget from "app/client/mall/js/lib/common.js";
import * as tplUtil from "app/client/mall/js/lib/mall-tpl.js";
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
    "click .js-to-goods-detail": "toGoodsDetail",
    "click .js-to-order-detail": "toOrderDetail"
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
    window.console.log(this.model);
    // 取消成功 operateType重置为0
    //         action 重置为2 再次购买

  },

  // 删除订单
  deleteOrder() {

  },

  // 去支付
  toPurchase() {

  },

  // 查看物流
  toExpressInfo() {
    const url = `/fe/app/client/mall/html/detail-page/express/list.html?orderId=${this.orderDetail.orderid}`;
    widget.createNewView({ url });
  },

  // 再次购买
  toGoodsDetail() {
    let url = `${tplUtil.getBlockUrl({action: 0})}?productid=${this.model.get('productid')}`;
    widget.createNewView({ url });
  },

  toOrderDetail() {
    widget.createNewView({
      url: `/fe/app/client/mall/html/detail-page/order-detail.html?orderid=${this.model.get("orderid")}&from=order-list-page`,
      title: "订单详情"
    });
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
