// 申请退款
// import $ from "jquery";
// import _ from "lodash";
import Backbone from "backbone";
import * as mallPromise from "app/client/mall/js/lib/mall-promise.js";

const RefundView = Backbone.View.extend({
  el: "#refund-main",

  events: {
    "click .refund-submit": "refundSubmit"
  },

  initialize() {
    this.fetch();
  },

  fetch() {
    // 根据orderid 获取退款状态
    // 如果没有，则渲染申请退款视图
    // 如果有，则渲染退款状态
    mallPromise
      .getAppInfo()
      .then(userData => {
        window.console.log(userData);
      })
      .catch(mallPromise.catchFn);
  },

  render() {

  },

  // 提交退款申请
  refundSubmit() {

  }
});

new RefundView();
