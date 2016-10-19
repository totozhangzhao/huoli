import _ from "lodash";
import BaseView from "app/client/mall/js/common/views/BaseView.js";
import * as tplUtil from "app/client/mall/js/lib/mall-tpl.js";
import * as widget from "app/client/mall/js/lib/common.js";

const AppView = BaseView.extend({
  el: "#coupon-detail",
  events: {
    "click .js-new-page": "createNewPage",
    "click .js-get-url" : "handleGetUrl"
  },
  initialize(commonData) {
    _.extend(this, commonData);
  },
  resume() {
    const data = this.cache.couponList[this.cache.couponIndex];
    this.render(data);
    widget.updateViewTitle(this.$el.data("title"));
  },
  render(data) {
    const tmpl = require("app/client/mall/tpl/profile/coupon-detail.tpl");
    this.$el.html(tmpl({
      item: data,
      tplUtil
    }));
  }
});

export default AppView;
