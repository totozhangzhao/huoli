import $ from "jquery";
import _ from "lodash";
import Backbone from "backbone";
import async from "async";
import NativeAPI from "app/client/common/lib/native/native-api.js";
import {sendPost} from "app/client/mall/js/lib/mall-request.js";
import {toast} from "com/mobile/widget/hint/hint.js";
import hint from "com/mobile/widget/hint/hint.js";
import appInfo from "app/client/mall/js/lib/app-info.js";
import {parseUrlSearch as parseUrl} from "com/mobile/lib/url/url.js";
import widget from "app/client/mall/js/lib/common.js";
import mallUitl from "app/client/mall/js/lib/util.js";
import pageAction from "app/client/mall/js/lib/page-action.js";
import logger from "com/mobile/lib/log/log.js";
import storage from "app/client/mall/js/lib/storage.js";
import tplUtil from "app/client/mall/js/lib/mall-tpl.js";
const orderLog   = require("app/client/mall/js/lib/common.js").initTracker("order");
import ui from "app/client/mall/js/lib/ui.js";
import FooterView from "app/client/mall/js/common/views/footer.js";
import BackTop from "com/mobile/widget/button/to-top.js";

import BuyNumModel from "app/client/mall/js/common/models/buy-num-model.js";
import BuyPanelView from "app/client/mall/js/common/views/pay/buy-num-panel.js";

const AppView = Backbone.View.extend({
  el: "#order-detail-container",
  events: {
    "click a"                 : "createNewPage",
    "touchstart .js-copy"     : "copyText",
    "click .js-crowd-page"    : "gotoCrowd",
    "click .js-address-box"   : "handleAddressInfo",
    "click .btn-cancel-order" : "cancelOrder"
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

    async.waterfall([
      next => {
        appInfo.getUserData((err, userData) => {
          if (err) {
            toast(err.message, 1500);
            return;
          }

          next(null, userData);
        });
      },
      (userData, next) => {
        const params = _.extend({}, userData.userInfo, {
          p: userData.deviceInfo.p,
          orderid: parseUrl().orderid
        });

        sendPost("orderNewDetail", params, (err, data) => {
          if (err) {
            next(err);
            return;
          }

          next(null, data);
        });
      }
    ], (err, result) => {
      if (err) {
        toast(err.message, 1500);
        return;
      }

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
    });
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
    const self = this;

    if (this.isPaying) {
      return;
    }

    hint.showLoading();

    const orderDetail = this.orderDetail;

    if (!orderDetail.needpay) {
      toast("此订单不是需要支付的状态", 1500);
      return;
    }

    this.isPaying = true;

    async.waterfall([
      next => {
        let payUrl = `${window.location.origin}/bmall/payview.do?orderid=${orderDetail.orderid}`;

        if ( mallUitl.isHangbanFunc() ) {
          payUrl = `${window.location.origin}/bmall/hbpayview.do?orderid=${orderDetail.orderid}`;
        }

        // orderid: 订单ID
        // createtime: 创建时间
        // statusstr: 状态显示串
        // productid: 产品id
        // stattpl: 状态模板（数字型，1: 完成订单模板  2: 失败订单模板  3: 待支付模板）
        // orderprice: 订单价格
        // msgtpl: 信息区模板（数字型，0: 不显示 1: 电子码模板， 2: 第三方用户名（包括电话号码）模板，3: 地址模板）
        // msg: 信息区内容
        // img: 图片url
        // title: 商品标题
        // shotdesc: 商品短描述
        // price: 商品价格
        // note: 使用说明
        // needpay: 是否需要支付，1: 需要，0: 不需要，2: 补全地址
        // payprice: 支付价格
        // payorderid: 支付订单ID
        if (orderDetail.needpay) {

          // quitpaymsg  String 退出时候的提示
          // title       String 支付标题
          // price       String 商品价格
          // orderid     String 订单号
          // productdesc String 商品描述
          // url         String 显示订单基本信息的Wap页面
          // subdesc     String 商品详情描述
          const payParams = {
            quitpaymsg: "您尚未完成支付，如现在退出，可稍后进入“全部订单->订单详情”完成支付。确认退出吗？",
            title: "支付订单",
            price: orderDetail.payprice,
            orderid: orderDetail.payorderid,
            productdesc: orderDetail.title,
            url: payUrl,
            subdesc: orderDetail.shotdesc
          };

          NativeAPI.invoke("startPay", payParams, (err, payData) => {
            next(err, payData);
          });
        } else {
          next(null, null);
        }
      },
      (payData, next) => {
        storage.get("mallInfo", data => {
          data = data || {};
          next(null, payData, data);
        });
      },
      (payData, data, next) => {
        data.status = data.status || {};
        data.status.orderChanged = true;
        storage.set("mallInfo", data, () => {
          next(null, payData);
        });
      }
    ], () => {
      self.isPaying = false;
      // hint.hideLoading();
      window.location.reload();
    });
  },

  cancelOrder(e) {
    this.payView.remove();
    window.console.log(e);
  }
});

new AppView();
