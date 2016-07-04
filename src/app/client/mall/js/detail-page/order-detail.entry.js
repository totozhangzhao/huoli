import $ from "jquery";
import _ from "lodash";
import Backbone from "backbone";
// import async from "async";
import NativeAPI from "app/client/common/lib/native/native-api.js";
import {sendPost} from "app/client/mall/js/lib/mall-request.js";
import {toast} from "com/mobile/widget/hint/hint.js";
import hint from "com/mobile/widget/hint/hint.js";
import cookie from "com/mobile/lib/cookie/cookie.js";

// import appInfo from "app/client/mall/js/lib/app-info.js";
import {parseUrlSearch as parseUrl} from "com/mobile/lib/url/url.js";
import * as widget from "app/client/mall/js/lib/common.js";
import * as mallUitl from "app/client/mall/js/lib/util.js";
import pageAction from "app/client/mall/js/lib/page-action.js";
import logger from "com/mobile/lib/log/log.js";
// import storage from "app/client/mall/js/lib/storage.js";
import tplUtil from "app/client/mall/js/lib/mall-tpl.js";
const orderLog   = require("app/client/mall/js/lib/common.js").initTracker("order");
import ui from "app/client/mall/js/lib/ui.js";
import FooterView from "app/client/mall/js/common/views/footer.js";

import BackTop from "com/mobile/widget/button/to-top.js";
import Popover from "com/mobile/widget/popover/popover.js";
import * as mallPromise from "app/client/mall/js/lib/mall-promise.js";

import BuyNumModel from "app/client/mall/js/common/models/buy-num-model.js";
import BuyPanelView from "app/client/mall/js/common/views/pay/buy-num-panel.js";

const AppView = Backbone.View.extend({
  el: "#order-detail-container",
  events: {
    "click a"                 : "createNewPage",
    "touchstart .js-copy"     : "copyText",
    "click .js-crowd-page"    : "gotoCrowd",
    "click .js-address-box"   : "handleAddressInfo",
    "click .btn-cancel-order" : "cancelOrder",
    "click .btn-refund"       : "toRefund",
    "click .btn-refund-result": "toRefundResult"
  },
  initialize() {
    new BackTop();
    NativeAPI.invoke("updateTitle", {
      text: "订单详情"
    });
    this.buyNumModel = new BuyNumModel();
    this.payView = new BuyPanelView({
      model: this.buyNumModel,
      buy: () => {this.buy();},
      pay() {}
    });
    this.$initial = ui.initial().show();
    this.orderDetail = {};
    this.isPaying = false;
    this.mallOrderDetail();
    pageAction.setClose();
    logger.track(`${mallUitl.getAppName()}PV`, "View PV", document.title);
    this.bindResume();
  },
  copyText(e) {
    const $text = $(e.currentTarget).find(".js-copy-text");

    if ( $text.length !== 1 ) {
      return;
    }

    NativeAPI.invoke("copyToClipboard", {
      text: $text.text()
    }, (err, data) => {
      if (err) {
        return;
      }

      if (data.value === data.SUCC) {
        toast("复制成功", 1500);
      }
    });
  },
  handleAddressInfo() {
    const needpay = this.orderDetail.needpay;

    if (needpay === 2) {
      this.gotoAddressList();
    } else {
      this.gotoExpressInfoView();
    }
  },
  gotoAddressList() {
    const id = this.orderDetail.orderid;
    const url = `/fe/app/client/mall/html/detail-page/goods-detail.html?mold=order&orderid=${id}#address-list`;

    window.location.href = url;
  },
  gotoExpressInfoView() {
    const expressInfo = this.orderDetail.express;

    if (!expressInfo) {
      return;
    }

    // companyid: 快递公司id
    // company：快递公司名称
    // tracking: 快递单号
    const url = `/fe/app/client/mall/html/detail-page/express-info.html?tracking=${expressInfo.tracking}&company=${encodeURIComponent(expressInfo.company)}&companyid=${expressInfo.companyid}`;

    widget.createNewView({ url });
  },
  gotoCrowd() {
    const url = `${tplUtil.getBlockUrl({ action: 6 })}?productid=${this.orderDetail.productid}`;

    widget.createNewView({ url });
  },
  createNewPage(e) {
    widget.createAView(e);
  },
  mallOrderDetail() {
    const self = this;
    mallPromise
      .getAppInfo()
      .then(userData => {
        const params = _.extend({}, userData.userInfo, {
          p: userData.deviceInfo.p,
          orderid: parseUrl().orderid
        });
        return new Promise((resovle, reject) => {
          sendPost("orderNewDetail", params, (err, data) => {
            if (err) {
              reject(err);
            } else {
              resovle(data);
            }
          });
        });

      })
      .then(result => {
        self.orderDetail = result;
        const compiled = require("app/client/mall/tpl/detail-page/order-detail.tpl");
        const tmplData = {
          orderDetail: self.orderDetail
        };

        $("#order-detail-container").html( compiled(tmplData) );
        self.renderBuyNumView(result);
        new FooterView().render();
        self.$initial.hide();
        orderLog({
          title: self.orderDetail.title,
          from: parseUrl().from || "--"
        });
      }).catch( err => {
        toast(err.message, 1500);
      });

    // async.waterfall([
    //   next => {
    //     appInfo.getUserData((err, userData) => {
    //       if (err) {
    //         toast(err.message, 1500);
    //         return;
    //       }

    //       next(null, userData);
    //     });
    //   },
    //   (userData, next) => {
    //     const params = _.extend({}, userData.userInfo, {
    //       p: userData.deviceInfo.p,
    //       orderid: parseUrl().orderid
    //     });

    //     sendPost("orderNewDetail", params, (err, data) => {
    //       if (err) {
    //         next(err);
    //         return;
    //       }

    //       next(null, data);
    //     });
    //   }
    // ], (err, result) => {
    //   if (err) {
    //     toast(err.message, 1500);
    //     return;
    //   }

    //   self.orderDetail = result;

    //   const compiled = require("app/client/mall/tpl/detail-page/order-detail.tpl");
    //   const tmplData = {
    //     orderDetail: self.orderDetail
    //   };

    //   $("#order-detail-container").html( compiled(tmplData) );
    //   self.renderBuyNumView(result);
    //   new FooterView().render();
    //   self.$initial.hide();
    //   orderLog({
    //     title: self.orderDetail.title,
    //     from: parseUrl().from || "--"
    //   });
    // });
  },

  renderBuyNumView(order) {
    if(order.needpay !== 1){
      return;
    }
    this.buyNumModel.set({
      type:0,
      hasMask: false,
      visible: true,
      payText:"去支付",
      points: order.ptotal,
      price: order.mtotal,
      number: 1,
      canPay: true,
      parentDom: "#order-detail-container"
    });
  },
  buy() {
    this.payOrder();
  },
  payOrder() {
    function success() {
      window.location.reload();
    }
    const orderInfo = this.orderDetail;
    if (orderInfo.needpay) {
      orderInfo.token = cookie.get("token");
      orderInfo.returnUrl = window.location.href;
      return mallPromise
        .initPay(orderInfo)
        .then(success);
    } else {
      return success();
    }
  },

  cancelOrder() {
    let self = this;
    if( !this.cancleConfirm ) {
      this.cancleConfirm = new Popover({
        type: "confirm",
        title: "确定要取消订单吗？",
        message: "",
        agreeText: "确定",
        cancelText: "取消",
        agreeFunc() {
          self.cancelOrderHanlder();
        },
        cancelFunc() {}
      });
    }
    this.cancleConfirm.show();
  },

  cancelOrderHanlder() {
    hint.showLoading();
    mallPromise
      .getAppInfo()
      .then(userData => {
        const params = _.extend({}, userData.userInfo, {
          p: userData.deviceInfo.p,
          orderid: parseUrl().orderid
        });
        return new Promise( (resolve, reject) => {
          sendPost("cancelOrder", params, (err, result) => {
            hint.hideLoading();
            if(err) {
              reject(err);
            }else {
              resolve(result);
            }
          });
        });
      })
      .then( result => {
        if(result === "ok") {
          let alertMsg = new Popover({
            type: "alert",
            title: "提示信息",
            message: "订单已取消",
            agreeText: "确定",
            cancelText: "取消",
            agreeFunc() {
              window.location.reload();
            },
            cancelFunc() {}
          });
          alertMsg.show();
        }
      }).catch( err => {
        toast(err.message, 3000);
      });
  },

  // 跳转至退货申请页面
  toRefund() {
    const url = `/fe/app/client/mall/html/detail-page/refund.html?orderid=${this.orderDetail.orderid}`;
    widget.createNewView({ url });
  },

  // 跳转至退款结果查看页面
  toRefundResult() {
    const url = `/fe/app/client/mall/html/detail-page/refund-result.html?orderid=${this.orderDetail.orderid}`;
    widget.createNewView({ url });
  },
  bindResume() {
    NativeAPI.registerHandler("resume", () => {
      window.location.reload();
    });
  }
});

new AppView();
