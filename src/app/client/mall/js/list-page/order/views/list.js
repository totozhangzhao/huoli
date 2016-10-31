import $ from "jquery";
import _ from "lodash";
import Backbone from "backbone";
import NativeAPI from "app/client/common/lib/native/native-api.js";
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
import SearchView from "app/client/mall/js/list-page/order/views/search-view.js";


// templates
// import ordersTpl from "app/client/mall/tpl/list-page/order/order-list.tpl";

// 订单列表数据初始化
var OrderData = {};
const OrderListView = Backbone.View.extend({
  el: "#order-list",

  events: {
    "click [data-filter]": "orderFilter"

  },

  initialize() {
    this.loading = false;
    const nav = new Navigator();
    nav.render();
    this.$initial = ui.initial().show();
    this.searchView = new SearchView({
      listView: this
    });
    this.orderNavView = new OrderNavView();
    this.orderListContainer = this.$el.find(".order-content .record-bar");
    this.setSearchBtn("搜索");
    this.bindEvents();
    NativeAPI.registerHandler("headerRightBtnClick", this.searchBtnClickHandler);
    logger.track(mallUtil.getAppName() + "PV", "View PV", document.title);
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
    this.hideNoOrderView();
    this.useSearch = options.search || false;
    if(this.useSearch) {
      this.mapKey = this.getTypeMapKey("search");
      this.showSearchView();
    } else {
      this.mapKey = this.getTypeMapKey(params.type);
      this.hideSearchView();
    }


    if( !OrderData[this.mapKey] ) {
      OrderData[this.mapKey] = {
        orders: new Orders(),
        active: true
      };
      if(this.mapKey === "search") {
        this.listenTo(OrderData[this.mapKey].orders, "reset", this.clearSearchOrders);
      }
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
    this.$el.find(`[data-filter-id=${params.type}]`).addClass("on");
    this.params = params;

    // 通过切换路由来的，如果已有数据，则只把已有的数据渲染
    if(options.reset) {
      if(OrderData[this.mapKey].orders.length == 0) {
        this.fetch();
      }
    } else {
      this.fetch();
    }
    window.console.log(OrderData);

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
          p    : userData.deviceInfo.p,
        });
        if(this.useSearch) {
          _.extend(params, {
            type: 4
          });
        }

        return new Promise((resolve, reject) => {
          sendPost("orderList", params, (err, data) => {
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
        window.console.log(result);
        OrderData[this.mapKey].orders.add(result);
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
    // 数据个数是20的整数倍时，可以加载更多
    if(OrderData[this.mapKey].orders.length % 20 === 0) {
      this.params.last = OrderData[this.mapKey].orders.last().get("orderid") || "";
      window.console.log(this.params);
      this.fetch();
    }
  },

  // 切换筛选条件
  orderFilter(e) {
    this.$el.find("[data-filter]").removeClass("on");
    let d = $(e.currentTarget);
    let orderType = (this.params.orderType === 1 ? 'mall': 'crowd');
    Backbone.history.navigate(`${orderType}/${d.data("filter")}`, {
      trigger: true,
      replace: true
    });
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

  },

  // 显示搜索页面
  showSearchView() {
    this.searchView.show();
    this.orderNavView.hide();
    // this.$el.hide();
  },

  // 隐藏搜索页面
  hideSearchView() {
    this.searchView.hide();
    this.orderNavView.show();
    // this.$el.show();
  },

  getTypeMapKey(type) {
    let key = "";
    switch(type) {
      case 0:
        key = "all";
        break;
      case 1:
        key = "pending";
        break;
      case 2:
        key = "express";
        break;
      case 3:
        key = "success";
        break;
      case "search":
        key = "search";
        break;
    }
    return key;
  },

  showNoOrderView() {
    $("#no-orders").show();
  },

  hideNoOrderView() {
    $("#no-orders").hide();
  },

  clearSearchOrders(a, list) {
    window.console.log(a);
    _.each(list.previousModels, (model) => {
      model.destroy();
    });
  },

  clearOrderList() {
    window.console.log(22222);
    OrderData[this.mapKey].orders.reset();
  }
});

export default OrderListView;
