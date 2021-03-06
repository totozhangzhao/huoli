// 申请退款
// import $ from "jquery";
import _ from "lodash";
import Backbone from "backbone";
// import * as mallPromise from "app/client/mall/js/lib/mall-promise.js";
import ui from "app/client/mall/js/lib/ui.js";
import UrlUtil from "com/mobile/lib/url/url.js";
import logger from "com/mobile/lib/log/log.js";
import * as mallUtil from "app/client/mall/js/lib/util.js";
import {sendPost} from "app/client/mall/js/lib/mall-request.js";
import * as mallPromise from "app/client/mall/js/lib/mall-promise.js";
import Navigator from "app/client/mall/js/common/views/header/navigator.js";
import "app/client/mall/js/lib/common.js";
import BackTop from "com/mobile/widget/button/to-top.js";
import * as mallWechat from "app/client/mall/js/lib/wechat.js";
mallWechat.initShare();

const RefundResultView = Backbone.View.extend({
  el: "#refund-result",

  template: require("app/client/mall/tpl/detail-page/refund/refund-result.tpl"),

  events: {},

  initialize() {
    const nav = new Navigator();
    nav.render();
    new BackTop();
    this.$initial = ui.initial().show();
    this.orderid = UrlUtil.parseUrlSearch().orderid;
    logger.track(`${mallUtil.getAppName()}PV`, "View PV", document.title);
    this.fetch();
  },

  fetch() {
    mallPromise
      .getAppInfo()
      .then((userData) => {
        const params = _.extend({}, userData.userInfo, {orderid: UrlUtil.parseUrlSearch().orderid});
        return new Promise((resolve, reject) => {
          sendPost("refoundDetail", params, (err, data) => {
            if(err) {
              reject(err);
            }else{
              resolve(data);
            }
          });
        })
        .then((data)=>{
          this.render(data);
        })
        .catch(mallPromise.catchFn);
      });
  },

  render(data) {
    this.$el.html(this.template({data:data}));
    this.$initial.hide();
  }
});

new RefundResultView();
