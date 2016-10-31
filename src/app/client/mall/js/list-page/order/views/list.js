import $ from "jquery";
import _ from "lodash";
import Backbone from "backbone";
import {sendPost} from "app/client/mall/js/lib/mall-request.js";
import ui from "app/client/mall/js/lib/ui.js";
import * as mallPromise from "app/client/mall/js/lib/mall-promise.js";
import logger from "com/mobile/lib/log/log.js";
import * as mallUtil from "app/client/mall/js/lib/util.js";
import * as widget from "app/client/mall/js/lib/common.js";

// collections
import Orders from "app/client/mall/js/list-page/order/collections/orders.js";
// views
import Navigator from "app/client/mall/js/common/views/header/navigator.js";
import OrderNavView from "app/client/mall/js/list-page/order/views/order-nav.js";
import OrderListItemView from "app/client/mall/js/list-page/order/views/order-list-item.js";


// templates
// import ordersTpl from "app/client/mall/tpl/list-page/order/order-list.tpl";

// 订单列表数据初始化
var orders = new Orders();
const OrderListView = Backbone.View.extend({
  el: "#order-list",

  events: {
    "click [data-filter]": "orderFilter"

  },

  initialize() {
    const nav = new Navigator();
    nav.render();
    this.$initial = ui.initial().show();
    this.$initial.hide();
    this.orderNavView = new OrderNavView();
    this.orderListContainer = this.$el.find(".order-content .record-bar");
    this.listenTo(orders, 'reset', this.ordersClear);
    logger.track(mallUtil.getAppName() + "PV", "View PV", document.title);
  },

  fetch(params = {}, reset) {
    this.orderNavView.render(params);
    this.$el.find(`[data-filter-id=${params.type}]`).addClass("on");
    this.params = params;
    if(reset) {
      orders.reset();
    }
    mallPromise
      .checkLogin({ reset: true })
      .then(userData => {
        // const params = _.extend({}, userData.userInfo, {
        //   p    : userData.deviceInfo.p,
        //   last : options.lastOrderId || "",
        //   type : options.listType || 1,
        //   key  : options.keywords,
        //   style
        // });
        _.extend(params, userData.userInfo, {
          p    : userData.deviceInfo.p,
        });

        return new Promise((resolve, reject) => {
          sendPost("orderList", params, (err, data) => {
            if (err) {
              reject(err);
            } else {
              resolve(data);
            }
          });
        });
      })
      .then(result => {
        orders.add(result);
        this.render();
      })
      .catch(err => {
        mallPromise.catchFn(err);
      });
  },

  render() {
    orders.forEach((item) => {
      if(!item.get("rendered")) {
        let itemView = new OrderListItemView({model: item});
        this.orderListContainer.append(itemView.render().el);
      }
    });
    widget.imageDelay();
    window.console.log(orders.length);
  },

  loadmore() {

  },

  // 切换筛选条件
  orderFilter(e) {
    this.$el.find("[data-filter]").removeClass("on");
    var d = $(e.currentTarget);
    var orderType = (this.params.orderType === 1 ? 'mall': 'crowd');
    Backbone.history.navigate(`${orderType}/${d.data("filter")}`, {
      trigger: true,
      replace: true
    });
  },

  // 清空当前集合
  ordersClear(e, c) {
    c.previousModels.forEach((item) => {
      item.destroy();
    });
    e === orders;
  }
});

export default OrderListView;
