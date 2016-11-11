import $ from "jquery";
import _ from "lodash";
import Backbone from "backbone";
import cookie from "com/mobile/lib/cookie/cookie.js";
import {config} from "app/client/mall/js/common/config.js";
import NativeAPI from "app/client/common/lib/native/native-api.js";
import {sendPost} from "app/client/mall/js/lib/mall-request.js";
import ui from "app/client/mall/js/lib/ui.js";
import * as mallPromise from "app/client/mall/js/lib/mall-promise.js";
import logger from "com/mobile/lib/log/log.js";
import * as mallUtil from "app/client/mall/js/lib/util.js";
import * as widget from "app/client/mall/js/lib/common.js";
import hint from "com/mobile/widget/hint/hint.js";
import UrlUtil from "com/mobile/lib/url/url.js";
const orderListLog = widget.initTracker("orderList");

import orderUtil from "app/client/mall/js/list-page/order/utils/order-utils.js";
// collections
import Orders from "app/client/mall/js/list-page/order/collections/orders.js";
// views
import Navigator from "app/client/mall/js/common/views/header/navigator.js";
import OrderNavView from "app/client/mall/js/list-page/order/views/order-nav.js";
import OrderListItemView from "app/client/mall/js/list-page/order/views/order-list-item.js";
import SearchView from "app/client/mall/js/list-page/order/views/search-view.js";

// 订单列表数据初始化
import OrderData from "app/client/mall/js/list-page/order/utils/order-data.js";

if(cookie.get('orderstatus') === 'update') {
  cookie.set("orderstatus", "release", config.mall.cookieOptions);
  window.location.reload();
}
const OrderListView = Backbone.View.extend({
  el: "#order-list",

  events: {
  },

  initialize() {
    window.aaa = this;
    this.loading = false;
    this.nav = new Navigator();
    this.nav.render();
    this.$initial = ui.initial().show();
    this.searchView = new SearchView({
      listView: this
    });
    this.orderNavView = new OrderNavView();
    this.orderListContainer = this.$el.find(".order-content .record-bar");
    this.setSearchBtn("搜索");
    this.bindEvents();
    NativeAPI.registerHandler("headerRightBtnClick", () => {
      this.searchBtnClickHandler();
    });
    this.registerAppResume();
    logger.track(mallUtil.getAppName() + "PV", "View PV", document.title);
    orderListLog({
      title: document.title,
      hlfrom: UrlUtil.parseUrlSearch().hlfrom || "--"
    });
  },

  bindEvents() {
    const screenHeight = $(window).height();
    const edgeHeight = screenHeight * 0.35;
    $(window).on("scroll", () => {
      if (this.loading) {
        return;
      }

      if ( $(window).scrollTop() + screenHeight > $(document).height() - edgeHeight ) {
        this.loadMore();
      }
    });
  },

  // 切换筛选条件
  changeView(params = {}, options) {
    hint.showLoading();
    this.hideNoOrderView();
    this.useSearch = options.search || false;
    let title = "订单列表";
    if(this.useSearch) {
      this.mapKey = "search";
      this.showSearchView();
      title = "搜索订单";
    } else {
      this.mapKey = orderUtil.getViewByTypeValue(params.orderStatus);
      title = `${orderUtil.getTitleByTypeValue(params.orderStatus)}订单`;
      this.hideSearchView();
    }

    widget.updateViewTitle(title);
    if( !OrderData[this.mapKey] ) {
      OrderData[this.mapKey] = {
        orders: new Orders(),
        active: true
      };
      this.listenTo(OrderData[this.mapKey].orders, "reset", this.resetOrdersHandler);
    }
    _.each(OrderData, (item, key) => {
      if(item.active && (key != this.mapKey)) {
        item.orders.hide();
        item.active = false;
      }
      if(key === this.mapKey && !item.active){
        item.orders.show();
        item.active = true;
      }
    });

    this.orderNavView.render(params);
    this.$el.find(`[data-filter-id=${params.orderStatus}]`).addClass("on");
    this.params = params;

    // 通过切换路由来的，如果已有数据，则只把已有的数据渲染
    if(!this.useSearch && (OrderData[this.mapKey].orders.length == 0)) {
      this.fetch();
    } else {
      if(this.useSearch) {
        OrderData[this.mapKey].orders.reset();
      }
      this.$initial.hide();
      hint.hideLoading();
      widget.imageDelay();
    }
    /**
     * 数据不缓存
     */
    // OrderData[this.mapKey].orders.reset();
    // if(this.useSearch){
    //   this.$initial.hide();
    //   hint.hideLoading();
    // } else {
    //   this.fetch();
    // }


  },

  // 查询数据
  fetch() {
    if(this.loading) {
      return;
    }
    this.loading = true;
    this.hideNoOrderView();
    mallPromise
      .checkLogin({ reset: true })
      .then(userData => {

        let params = _.extend({}, this.params, userData.userInfo, {
          p: userData.deviceInfo.p
        });
        if(this.useSearch) {
          _.extend(params, {
            orderStatus: 4
          });
        }

        return new Promise((resolve, reject) => {
          sendPost("orderList", params, (err, data) => {
            hint.hideLoading();
            this.params.last = "";
            this.loading = false;
            if (err) {
              reject(err);
            } else {
              resolve(data);
            }
          });
        });
      })
      .then(result => {
        OrderData[this.mapKey].orders.add(result);
        OrderData[this.mapKey].orders.setOrderType(this.params.orderType);
        this.render();
        this.$initial.hide();
        this.loading = false;
      })
      .catch(err => {
        mallPromise.catchFn(err);
      });
  },

  // 渲染视图
  render() {
    if( OrderData[this.mapKey].orders.length === 0 ) {
      this.showNoOrderView();
      return;
    }
    OrderData[this.mapKey].orders
    .where({rendered: false})
    .forEach((item) => {
      if(!item.get("rendered")) {
        let itemView = new OrderListItemView({model: item});
        this.orderListContainer.append(itemView.render().el);
      }
    });
    widget.imageDelay();
  },

  // 加载更多
  loadMore() {
    // 由于有删除功能，无论是否为20的整数倍，都执行加载更多
    if(OrderData[this.mapKey].orders.last()) {
      this.params.last = OrderData[this.mapKey].orders.last().get("orderid") || "";
      this.fetch();
    }
  },

  // app中设置右上角按钮
  setSearchBtn(text) {
    NativeAPI.invoke("updateHeaderRightBtn", {
      action: "show",
      text
    }, err => {
      if (err) {
        window.console.log(err.message);
        return;
      }
    });
  },

  // app中 右上角按钮点击事件处理
  searchBtnClickHandler() {
    let targetView = "";
    if( this.searchView.$el.is(":visible")) {
      targetView = "";
      this.setSearchBtn("搜索");
    } else {
      targetView += "search/";
      this.setSearchBtn("取消");
    }
    let orderType = (this.params.orderType !== 1 ? 'crowd': 'mall');
    let view = `${targetView}${orderType}/${orderUtil.getViewByTypeValue(this.params.orderStatus)}`;
    Backbone.history.navigate(view, {
      trigger: true,
      replace: true
    });
  },

  test() {
    this.searchBtnClickHandler();
  },

  // 显示搜索页面
  showSearchView() {
    this.searchView.show();
    this.orderNavView.hide();
    this.nav.hide();
  },

  // 隐藏搜索页面
  hideSearchView() {
    this.searchView.hide();
    this.orderNavView.show();
    this.nav.show();
  },

  showNoOrderView() {
    $("#no-orders").show();
  },

  hideNoOrderView() {
    $("#no-orders").hide();
  },

  resetOrdersHandler(a, list) {
    _.each(list.previousModels, (model) => {
      model.destroy();
    });
    return a;
  },

  clearOrderList() {
    OrderData[this.mapKey].orders.reset();
  },

  registerAppResume() {
    NativeAPI.registerHandler("resume", () => {
      if(cookie.get('orderstatus') === 'update') {
        cookie.set("orderstatus", "release", config.mall.cookieOptions);
        window.location.reload();
      }
    });
  }
});

export default OrderListView;
