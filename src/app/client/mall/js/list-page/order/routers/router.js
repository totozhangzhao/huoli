
import _ from "lodash";
import Backbone from "backbone";
import ListView from "app/client/mall/js/list-page/order/views/list.js";
// collections
import Orders from "app/client/mall/js/list-page/order/collections/orders.js";
// import {parseUrlSearch as parseUrl} from "com/mobile/lib/url/url.js";

/*
参数说明 style
  1 商城
  2 一元夺宝
  3 保险
  4 优惠券

*/
var typeEnum = {
  "all": {
    title: "全部",
    style:0
  },
  "pending": {
    title: "待处理",
    style:1
  },
  "success": {
    title: "交易成功",
    style:3
  },
  "cancle": {
    title: "已取消",
    style:4
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
    window.console.log(1123);
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
      type : 1,
      style: typeEnum[type].style,
      last: ""
    };
    this.listView.fetch(params, typeEnum[type].orders);
  },

  crowdDispatch(type) {
    window.console.log(type);
  }
});

export default ExpressRouter;
