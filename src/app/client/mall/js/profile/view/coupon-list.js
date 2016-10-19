import $ from "jquery";
import _ from "lodash";
import Backbone from "backbone";
import {sendPost} from "app/client/mall/js/lib/mall-request.js";
import * as mallPromise from "app/client/mall/js/lib/mall-promise.js";
import ui from "app/client/mall/js/lib/ui.js";
import * as widget    from "app/client/mall/js/lib/common.js";

const AppView = Backbone.View.extend({
  el: "#coupon-list",
  events: {
    "click .js-item": "showCoupon"
  },
  initialize(commonData) {
    _.extend(this, commonData);
    this.$blank = ui.blank("您还没有优惠券");
  },
  resume() {
    this.fetchData();
    widget.updateViewTitle(this.$el.data("title"));
  },
  showCoupon(e) {
    this.cache.couponIndex = $(e.currentTarget).data("index");
    this.router.switchTo("coupon-detail");
  },
  fetchData() {
    const self = this;
    mallPromise.getAppInfo()
      .then(userData => {
        const params = _.extend({}, userData.userInfo, {
          p: userData.deviceInfo.p
        });

        return new Promise((resolve, reject) => {
          sendPost("couponList", params, (err, data) => {
            if (err) {
              reject(err);
            } else {
              resolve(data);
            }
          });
        });
      })
      .then(data => {
        self.cache.couponList = data;
        self.render(data);
      })
      .catch(mallPromise.catchFn);
  },
  render(data) {
    if (data.length > 0) {
      const tmpl = require("app/client/mall/tpl/profile/coupon-list.tpl");
      this.$el.html(tmpl({
        couponList: data
      }));
    } else {
      this.$el.html( this.$blank );
    }
  }
});

export default AppView;
