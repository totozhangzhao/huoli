import $ from "jquery";
import Backbone from "backbone";
import {sendPost} from "app/client/mall/js/lib/mall-request.js";
import UrlUtil from "com/mobile/lib/url/url.js";
import ui from "app/client/mall/js/lib/ui.js";
// import * as mallPromise from "app/client/mall/js/lib/mall-promise.js";
import logger from "com/mobile/lib/log/log.js";
var mallUtil  = require("app/client/mall/js/lib/util.js");
import "app/client/mall/js/lib/common.js";
import "com/mobile/lib/jquery-collapse/src/jquery.collapse.js";
// views
import ExpressListTpl from "app/client/mall/tpl/detail-page/express/express-list.tpl";
import Navigator from "app/client/mall/js/common/views/header/navigator.js";
const ExpressListView = Backbone.View.extend({
  el: "#express-list",

  events: {
    "click nav[data-express]": "scrollTop"
  },

  initialize() {
    const nav = new Navigator();
    nav.render();
    this.$initial = ui.initial().show();
    logger.track(mallUtil.getAppName() + "PV", "View PV", document.title);
  },

  fetch(tracking) {
    this.curTracking = tracking;
    let params = {
      orderid: UrlUtil.parseUrlSearch().orderId
    };
    var p = new Promise((resolve, reject) => {
      sendPost("getExpressByOrder", params, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
        this.$initial.hide();
      });
    });
    p.then((result) => {
      this.render(result.express);
    })
    .catch(() => {
      // mallPromise.catchFn();
      this.$el.html($('<img class="express-empty" src="http://cdn.rsscc.cn/guanggao/img/icon/express-empty.png" alt="">'));
    });
  },

  render(express) {
    this.$el.html(ExpressListTpl({
      dataList: express,
      curTracking: this.curTracking
    }));
    this.$el.collapse({
      query: "nav[data-express]"
    });
  },

  scrollTop() {
    $('body').scrollTop(0);
  }
});

export default ExpressListView;
