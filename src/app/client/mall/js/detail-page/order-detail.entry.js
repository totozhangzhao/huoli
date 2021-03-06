import $ from "jquery";
import _ from "lodash";
import Backbone from "backbone";
import NativeAPI from "app/client/common/lib/native/native-api.js";
import {sendPost} from "app/client/mall/js/lib/mall-request.js";
import {toast} from "com/mobile/widget/hint/hint.js";
import hint from "com/mobile/widget/hint/hint.js";
import cookie from "com/mobile/lib/cookie/cookie.js";
import {config} from "app/client/mall/js/common/config.js";
import {parseUrlSearch as parseUrl} from "com/mobile/lib/url/url.js";
import pageAction from "app/client/mall/js/lib/page-action.js";
import logger from "com/mobile/lib/log/log.js";
import wechatUtil from "com/mobile/widget/wechat-hack/util.js";
import ui from "app/client/mall/js/lib/ui.js";
import FooterView from "app/client/mall/js/common/views/footer.js";
import BackTop from "com/mobile/widget/button/to-top.js";
import Popover from "com/mobile/widget/popover/popover.js";

import BuyNumModel from "app/client/mall/js/common/models/buy-num-model.js";
import BuyPanelView from "app/client/mall/js/detail-page/order-detail/views/payment-panel.js";
import Navigator from "app/client/mall/js/common/views/header/navigator.js";
import * as tplUtil from "app/client/mall/js/lib/mall-tpl.js";
import * as mallUtil from "app/client/mall/js/lib/util.js";
import * as mallPromise from "app/client/mall/js/lib/mall-promise.js";
import * as mallWechat from "app/client/mall/js/lib/wechat.js";
import * as widget from "app/client/mall/js/lib/common.js";
import orderDetailTpl from "app/client/mall/tpl/detail-page/order-detail.tpl";
import GiftContentView from "app/client/mall/js/detail-page/order-detail/views/gift-status.js";
const orderLog = widget.initTracker("order");

const AppView = Backbone.View.extend({
  el: "#order-detail-container",
  events: {
    "click a"                 : "createNewPage",
    "touchstart .js-copy"     : "copyText",
    "click .js-crowd-page"    : "gotoCrowd",
    "click .js-address-box"   : "handleAddressInfo",
    "click .btn-cancel-order" : "cancelOrder",
    "click .btn-refund"       : "toRefund",
    "click .btn-refund-result": "toRefundResult",
    "click .btn-toSubscribe"  : "toSubscribe",
    "click .common-shadow"    : "hideSubscribe",
    "click p[data-tracking]"   : "gotoNewExpressInfoView"
  },
  initialize() {
    // 从订单详情回到订单列表时，订单列表重新同步数据
    cookie.set("orderstatus",'update', config.mall.cookieOptions);
    const nav = new Navigator();
    nav.render();
    new BackTop();
    NativeAPI.invoke("updateTitle", {
      text: "订单详情"
    });
    this.$initial = ui.initial().show();
    this.orderDetail = {};
    this.isPaying = false;
    this.mallOrderDetail();
    pageAction.setClose();
    logger.track(`${mallUtil.getAppName()}PV`, "View PV", document.title);
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
      // this.gotoExpressInfoView();
    }
  },
  gotoAddressList() {
    const id = this.orderDetail.orderid;
    const url = `/fe/app/client/mall/html/detail-page/goods-detail.html?mold=order&orderid=${id}#address-list`;

    window.location.href = url;
  },

  // 跳转到新物流页面
  gotoNewExpressInfoView(e) {
    var tracking = $(e.currentTarget).data("tracking");
    const url = `/fe/app/client/mall/html/detail-page/express/list.html?orderId=${this.orderDetail.orderid}#${tracking}`;
    widget.createNewView({ url });
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
    mallPromise
      // .getAppInfo()
      .checkLogin()
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
        this.orderDetail = result;
        this.initModel(this.orderDetail);
        this.orderDetail.unitPriceText = this.buyNumModel.getPPriceText(1);
        this.orderDetail.totalPriceText = tplUtil.getMoneyText({
          payType: this.buyNumModel.get("payType"),
          number: 1,
          price: this.orderDetail.mtotal,
          points: this.orderDetail.ptotal
        });
        this.render();
        orderLog({
          title: this.orderDetail.title,
          hlfrom: parseUrl().hlfrom || "--"
        });
      }).catch( err => {
        toast(err.message, 1500);
      });
  },

  render() {
    let data = {
      orderDetail: this.orderDetail,
      isWechat: wechatUtil.isWechatFunc(),
      productItem: {
        productid: this.orderDetail.productid,
        title: this.orderDetail.title,
        action: this.orderDetail.action || 9
      },
      tplUtil
    };
    this.$el.html(orderDetailTpl(data));
    if(this.orderDetail.giftContent) {
      this.giftContentView = new GiftContentView({orderDetail: this.orderDetail});
      this.giftContentView.render();
    } else {
      // 是微信送礼的情况 不使用默认分享
      mallWechat.initShare({
        wechatshare: this.orderDetail.wechatshare,
        title: this.orderDetail.title
      });
    }
    this.renderBuyNumView(this.orderDetail);
    new FooterView().render();


    this.$initial.hide();
  },

  initModel(order) {
    this.buyNumModel = new BuyNumModel({
      type:0,
      payType: order.paytype,
      hasMask: false,
      visible: true,
      payText:"去支付",
      points: order.points,
      price: order.money,
      number: order.num,
      canPay: true,
      parentDom: "#order-detail-container"
    });
  },
  renderBuyNumView(order) {
    if(order.needpay !== 1){
      return;
    }

    this.payView = new BuyPanelView({
      model: this.buyNumModel,
      buy: () => {this.buy();},
      pay() {}
    });

    this.buyNumModel.set({
      _t: Date.now()
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
  },

  // 跳转至关注公众号扫码页面
  toSubscribe() {
    const url = "/fe/app/client/mall/html/wechat/qrcode.html";
    widget.createNewView({ url });
  },

  hideSubscribe(e) {
    $(e.currentTarget).hide();
  }
});

new AppView();
