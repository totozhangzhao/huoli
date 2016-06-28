// 申请退款
// import $ from "jquery";
// import _ from "lodash";
import Backbone from "backbone";

const RefundView = Backbone.View.extend({
  el: "#refund-main",

  events: {
    "click .refund-submit": "refundSubmit"
  },

  initialize() {
    this.$el.html("退款");
  },

  render() {

  },

  // 提交退款申请
  refundSubmit() {

  }
});

new RefundView();
