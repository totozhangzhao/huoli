// import $ from "jquery";
import _ from "lodash";
import Backbone from "backbone";
import {sendPost} from "app/client/mall/js/lib/mall-request.js";
import ui from "app/client/mall/js/lib/ui.js";
import * as mallPromise from "app/client/mall/js/lib/mall-promise.js";
import logger from "com/mobile/lib/log/log.js";
import * as mallUtil from "app/client/mall/js/lib/util.js";
import * as widget from "app/client/mall/js/lib/common.js";

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
    this.$initial.hide();
    logger.track(mallUtil.getAppName() + "PV", "View PV", document.title);
  },

  fetch(params = {}, orders) {
    if(orders.length > 0) {
      return this.render(orders);
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
        this.render(orders);
      })
      .catch(err => {
        mallPromise.catchFn(err);
      });
  },

  render(orders) {
    window.console.log(orders);
    this.$el.find(".order-content .record-bar").html("123");
    widget.imageDelay();
  },

  changeType(type) {
    Backbone.history.navigate(type ,{
      trigger: true,
      replace: true
    });
  }
});

export default OrderListView;
