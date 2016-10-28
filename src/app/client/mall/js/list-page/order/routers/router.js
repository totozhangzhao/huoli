
import _ from "lodash";
import Backbone from "backbone";
import ListView from "app/client/mall/js/list-page/order/views/list.js";
// collections
import Orders from "app/client/mall/js/list-page/order/collections/orders.js";
// import {parseUrlSearch as parseUrl} from "com/mobile/lib/url/url.js";

/*
参数说明 type
  1 商城
  2 一元夺宝
  3 保险
  4 优惠券

*/
var typeEnum = {
  "all": {
    title: "全部",
    type:0
  },
  "pending": {
    title: "待付款",
    type:1
  },
  "express": {
    title: "待收货",
    type:2
  },
  "success": {
    title: "已完成",
    type:3
  }
};
var ExpressRouter = Backbone.Router.extend({
  routes: {
    "": "default",
    ":action": "default",
    "mall/:action": "mallDispatch",
    "crowd/:action": "crowdDispatch"
  },

  initialize() {
    this.listView = new ListView();
  },

  default() {
    this.navigate("mall/all", {
      trigger: true,
      replace: true
    });
  },

  mallDispatch(type) {
    if( !_.includes(_.keys(typeEnum), type) ) {
      this.navigate("all", {
        trigger: true,
        replace: true
      });
      return;
    }
    if(!typeEnum[type].orders) {
      typeEnum[type].orders = new Orders();
    }
    let params = {
      style : 1,
      orderType : 1,
      type: typeEnum[type].type,
      last: ""
    };
    this.listView.fetch(params, typeEnum[type].orders);
  },

  crowdDispatch(type) {
    window.console.log(type);
  }
});

export default ExpressRouter;
