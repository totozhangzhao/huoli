// 申请退款
import $ from "jquery";
// import _ from "lodash";
import Backbone from "backbone";
// import * as mallPromise from "app/client/mall/js/lib/mall-promise.js";
import UrlUtil from "com/mobile/lib/url/url.js";

const RefundView = Backbone.View.extend({
  el: "#refund-main",

  events: {
    "click input.refund-type": "checkRefundType",
    "click .refund-submit": "refundSubmit",
    "click .test": "toResult"
  },

  initialize() {
    this.orderid = UrlUtil.parseUrlSearch().orderid;
    this.render();
  },

  render() {
    let a =$("<div class='test'>查看结果</div>");
    this.$el.html(a);
  },

  // 选择退款原因类型
  checkRefundType() {

  },
  // 提交退款申请
  refundSubmit() {

  },

  toResult() {
    let from = UrlUtil.parseUrlSearch().from || '';
    if( from ) {
      from = `&from=${from}`;
    }
    window.location.replace(`/fe/app/client/mall/html/detail-page/refund-result.html?orderid=${this.orderid}${from}`);
  }
});

new RefundView();
