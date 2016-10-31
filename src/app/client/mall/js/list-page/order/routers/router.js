import _ from "lodash";
import Backbone from "backbone";
import ListView from "app/client/mall/js/list-page/order/views/list.js";

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
    type: 0
  },
  "pending": {
    title: "待付款",
    type: 1
  },
  "express": {
    title: "待收货",
    type: 2
  },
  "success": {
    title: "已完成",
    type: 3
  }
};
var ExpressRouter = Backbone.Router.extend({
  routes: {
    "": "default",
    ":action": "default",
    "mall/:type": "mallDispatch",
    "crowd/:type": "crowdDispatch",
    "search/mall/:type": "mallSearchDispatch",
    "search/crowd/:type": "crowdSearchDispatch"
  },

  initialize() {
    this.listView = new ListView();
  },

  default(type) {
    let defaultView = "mall/all";
    if(type === "crowd") {
      defaultView = "crowd/all";
    }
    this.navigate(defaultView, {
      trigger: true,
      replace: true
    });
  },

  mallDispatch(type) {
    if( !_.includes(_.keys(typeEnum), type) ) {
      this.navigate("mall/all", {
        trigger: true,
        replace: true
      });
      return;
    }
    let params = {
      orderType: 1,
      type: typeEnum[type].type,
      last: ""
    };
    this.listView.changeView(params, {reset: true});
  },

  crowdDispatch(type) {
    if( !_.includes(_.keys(typeEnum), type) ) {
      this.navigate("crowd/all", {
        trigger: true,
        replace: true
      });
      return;
    }
    let params = {
      orderType: 2,
      type: typeEnum[type].type,
      last: ""
    };
    this.listView.changeView(params, {reset: true});
  },

  mallSearchDispatch(type) {
    if( !_.includes(_.keys(typeEnum), type) ) {
      this.navigate("search/mall/all", {
        trigger: true,
        replace: true
      });
    }
    let params = {
      orderType: 1,
      type: typeEnum[type].type,
      last: ""
    };
    this.listView.changeView(params, {reset: true, search: true});
  },
  crowdSearchDispatch(type) {
    if( !_.includes(_.keys(typeEnum), type) ) {
      this.navigate("search/crowd/all", {
        trigger: true,
        replace: true
      });
    }
    let params = {
      orderType: 2,
      type: typeEnum[type].type,
      last: ""
    };
    this.listView.changeView(params, {reset: true, search: true});
  }
});

export default ExpressRouter;
