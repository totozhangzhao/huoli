// import $ from "jquery";
import Backbone from "backbone";
// import {sendPost} from "app/client/mall/js/lib/mall-request.js";
// import UrlUtil from "com/mobile/lib/url/url.js";
import ui from "app/client/mall/js/lib/ui.js";
// import * as mallPromise from "app/client/mall/js/lib/mall-promise.js";
import logger from "com/mobile/lib/log/log.js";
import * as mallUtil from "app/client/mall/js/lib/util.js";
import "app/client/mall/js/lib/common.js";
// views
import Navigator from "app/client/mall/js/common/views/header/navigator.js";
const OrderListView = Backbone.View.extend({
  el: "#order-list",

  events: {
  },

  initialize() {
    const nav = new Navigator();
    nav.render();
    this.$initial = ui.initial().show();
    logger.track(mallUtil.getAppName() + "PV", "View PV", document.title);
  },

  fetch(type) {
    window.console.log(type);
  },

  render() {

  }
});

export default OrderListView;
