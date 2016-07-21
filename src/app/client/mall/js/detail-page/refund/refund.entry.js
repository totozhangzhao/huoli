// 申请退款
import $ from "jquery";
import _ from "lodash";
import Backbone from "backbone";
// import * as mallPromise from "app/client/mall/js/lib/mall-promise.js";
import ui from "app/client/mall/js/lib/ui.js";
import UrlUtil from "com/mobile/lib/url/url.js";
import logger from "com/mobile/lib/log/log.js";
import * as mallUitl from "app/client/mall/js/lib/util.js";
import {sendPost} from "app/client/mall/js/lib/mall-request.js";
import * as mallPromise from "app/client/mall/js/lib/mall-promise.js";
import {toast} from "com/mobile/widget/hint/hint.js";
import Popover from "com/mobile/widget/popover/popover.js";
import Navigator from "app/client/mall/js/menu/header/navigator.js";
import "app/client/mall/js/lib/common.js";
import BackTop from "com/mobile/widget/button/to-top.js";
import * as mallWechat from "app/client/mall/js/lib/wechat.js";
mallWechat.initShare();

const RefundView = Backbone.View.extend({
  el: "#refund-main",

  events: {
    "click input.refund-type": "checkRefundType",
    "click .refund-submit": "refundSubmit"
  },

  initialize() {
    const nav = new Navigator();
    nav.render();
    new BackTop();
    this.alert = new Popover({
      type: "alert",
      title: "",
      message: "",
      agreeText: "查看结果",
      agreeFunc:this.toResult.bind(this)
    });
    this.$initial = ui.initial().show();
    this.orderid = UrlUtil.parseUrlSearch().orderid;
    logger.track(`${mallUitl.getAppName()}PV`, "View PV", document.title);
    this.render();
  },

  render() {
    setTimeout(() => {
      this.$initial.hide();
      this.$el.show();
    }, 600);
  },

  // 提交退款申请
  refundSubmit() {
    if(!this.validateReason()) {
      return;
    }
    if(!this.validateContent()) {
      return;
    }

    let reason = encodeURIComponent(this.$el.find("input[name=reason]:checked").val());
    let content = encodeURIComponent($("#refund-content").val());

    mallPromise
      .getAppInfo()
      .then((userData)=>{
        const params = _.extend({}, userData.userInfo, {reason, content}, {orderid: UrlUtil.parseUrlSearch().orderid});
        return new Promise((resolve, reject) => {
          sendPost("refoundApply", params, (err, data) => {
            if(err) {
              reject(err);
            }else{
              resolve(data);
            }
          });
        });
      })
      .then((data) => {
        if(data.status === 11) {
          this.alert.model.set({
            title: "提示信息",
            message:  "您的退款申请我们已受到，谢谢您对管家商城的支持。"
          });
          this.alert.show();
        }
      })
      .catch(mallPromise.catchFn);


  },

  validateReason() {
    if(!this.$el.find("input[name=reason]:checked").val()) {
      // alert
      toast("请选择退款原因", 1500);
      return false;
    }
    return true;
  },

  validateContent() {
    let content = $("#refund-content").val();
    if(!content) {
      // alert 请填写退款说明
      toast("请填写退款说明", 1500);
      return false;
    }
    return true;
  },
  // 跳转到退款状态查看页面
  toResult() {
    let from = UrlUtil.parseUrlSearch().hlfrom || '';
    if( from ) {
      from = `&from=${from}`;
    }
    window.location.replace(`/fe/app/client/mall/html/detail-page/refund-result.html?orderid=${this.orderid}${from}`);
  }
});

new RefundView();
