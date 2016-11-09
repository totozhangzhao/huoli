import Backbone from "backbone";
import * as mallWechat from "app/client/mall/js/lib/wechat.js";
import ListView from "app/client/mall/js/list-page/order/views/list.js";
import orderUtil from "app/client/mall/js/list-page/order/utils/order-utils.js";
/*
参数说明 orderType
  1 商城
  2 一元夺宝
  3 保险
  4 优惠券
*/

var OrderListRouter = Backbone.Router.extend({
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
    this.registerShare();
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
    if( !orderUtil.hasType(type) ) {
      this.navigate("mall/all", {
        trigger: true,
        replace: true
      });
      return;
    }
    let params = {
      orderType: 1,
      orderStatus: orderUtil.getTypeValue(type),
      last: ""
    };
    this.listView.changeView(params, {changeView: true});
  },

  crowdDispatch(type) {
    if( !orderUtil.hasType(type) ) {
      this.navigate("crowd/all", {
        trigger: true,
        replace: true
      });
      return;
    }
    let params = {
      orderType: 2,
      orderStatus: orderUtil.getTypeValue(type),
      last: ""
    };
    this.listView.changeView(params, {changeView: true});
  },

  mallSearchDispatch(type) {
    if( !orderUtil.hasType(type) ) {
      this.navigate("search/mall/all", {
        trigger: true,
        replace: true
      });
    }
    let params = {
      orderType: 1,
      orderStatus: orderUtil.getTypeValue(type),
      last: ""
    };
    this.listView.changeView(params, {changeView: true, search: true});
  },
  crowdSearchDispatch(type) {
    if( !orderUtil.hasType(type) ) {
      this.navigate("search/crowd/all", {
        trigger: true,
        replace: true
      });
    }
    let params = {
      orderType: 2,
      orderStatus: orderUtil.getTypeValue(type),
      last: ""
    };
    this.listView.changeView(params, {changeView: true, search: true});
  },

  registerShare() {
    mallWechat.initShare();
  }
});

export default OrderListRouter;
