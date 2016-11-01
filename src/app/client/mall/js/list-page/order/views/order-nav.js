import $ from "jquery";
// import _ from "lodash";
import Backbone from "backbone";

// templates
import orderNavTpl from "app/client/mall/tpl/list-page/order/order-nav.tpl";
import OrderNavs from "app/client/mall/js/list-page/order/collections/order-nav.js";
import orderUtil from "app/client/mall/js/list-page/order/utils/order-utils.js";
const OrderListView = Backbone.View.extend({
  el: "#order-nav",

  events: {
    "click [data-filter]": "orderFilter"
  },

  initialize() {
    this.orderNavs = new OrderNavs(orderUtil.orderNavDataList);
  },

  render(params) {
    this.params = params;
    this.$el.html(orderNavTpl({
      params,
      dataList:this.orderNavs.toJSON()
    }));

  },

  show() {
    this.$el.show();
  },

  hide() {
    this.$el.hide();
  },

  orderFilter(e) {
    this.$el.find("[data-filter]").removeClass("on");
    let d = $(e.currentTarget);
    let orderType = (this.params.orderType !== 1 ? 'crowd': 'mall');
    Backbone.history.navigate(`${orderType}/${d.data("filter")}`, {
      trigger: true,
      replace: true
    });
  }
});

export default OrderListView;
