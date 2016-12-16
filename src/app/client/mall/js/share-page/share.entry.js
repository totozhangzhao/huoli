import $ from "jquery";
import Backbone from "backbone";
import _ from "lodash";
import {redpacketMessage} from "app/client/mall/js/common/message.js";
import * as mallPromise from "app/client/mall/js/lib/mall-promise.js";
import {sendPost} from "app/client/mall/js/lib/mall-request.js";
import hint from "com/mobile/widget/hint/hint.js";
import UrlUtil from "com/mobile/lib/url/url.js";
// import loadScript from "com/mobile/lib/load-script/load-script.js";
import cookie from "com/mobile/lib/cookie/cookie.js";
import shareUtil from "com/mobile/widget/wechat/util.js";
// import wechatUtil from "com/mobile/widget/wechat-hack/util.js";
import * as mallWechat from "app/client/mall/js/lib/wechat.js";
import logger from "com/mobile/lib/log/log.js";
import * as mallUtil from "app/client/mall/js/lib/util.js";
import ShareInput from "app/client/mall/js/share-page/share-input.js";
import ui from "app/client/mall/js/lib/ui.js";
import Popover from "com/mobile/widget/popover/popover.js";
import Navigator from "app/client/mall/js/common/views/header/navigator.js";
import * as widget from "app/client/mall/js/lib/common.js";

const sharePageLog = widget.initTracker("ad");

const AppView = Backbone.View.extend({
  el: "#interlayer",
  events: {
    "click .js-get-coupon": "getMallCoupon",
    "click .btn-get-coupon": "getCoupon",
    "click .js-create-order": "createOrderDispatch",
    "click .js-common-share": "handleShareButton",
    "click a": "createNewPage"
  },
  initialize() {
    const nav = new Navigator();
    nav.render();
    this.urlObj = UrlUtil.parseUrlSearch();
    this.$initial = ui.initial().show();
    this.alert = new Popover({
      type: "alert",
      title: "",
      message: "",
      agreeText: "确定"
    });
    this.mallInterlayer();
    logger.track(`${mallUtil.getAppName()}PV`, "View PV", document.title);
  },

  initCoupon() {
    this.$getCouponButton = this.$el.find(".js-get-coupon");
    if( this.$getCouponButton.length >0) {
      this.couponId = this.$getCouponButton.data("couponId");
      this.checkCouponButton();
    }
  },

  checkCouponButton(couponId) {
    mallPromise
      .checkLogin()
      .then((userData) => {
        const params = _.extend({}, userData.userInfo, {
          p: userData.deviceInfo.p,
          productid: couponId || this.couponId
        });
        return new Promise((resolve, reject) => {
          sendPost("getUserCouponStat", params, (err, data) => {
            if(err) {
              reject(err);
            } else {
              resolve(data);
            }
          });
        });
      })
      .then((result) => {
        /*
        -601：抱歉，优惠券活动失效
        -602: 您已经领过了，机会留给别人吧
        -104：抱歉，活动未开始
        -103：抱歉，活动已结束
        -114：抱歉，今日活动未开始，
        -113: 抱歉，今日活动已结束
        -115：抱歉，仅限新用户参加
        -116: 抱歉，您的级别不足
        -3330：请先登录
        1: 可以领取
       */
        switch(result.code) {
          case -602:
            this.$getCouponButton.removeClass("active");
            break;
          case 1:
          case -601:
          case -104:
          case -103:
          case -114:
          case -113:
          case -115:
          case -116:
          case -3330:
          default: {
            this.$getCouponButton.addClass("active");
            break;
          }
        }
      })
      .catch(mallPromise.catchFn);

  },
  // 点击领取优惠券
  getCoupon(e) {
    this.curCouponBtn = $(e.currentTarget);
    let couponId = $(e.currentTarget).data("imbluId");
    this.getMallCouponById(couponId);
  },

  getMallCoupon() {
    this.getMallCouponById(this.couponId);
  },
  getMallCouponById(couponId) {
    const self = this;
    mallPromise
      .checkLogin()
      .then(userData => {
        const params = _.extend({}, userData.userInfo, {
          p: userData.deviceInfo.p,
          productid: couponId
        });
        return new Promise((resolve, reject) => {
          sendPost("getCoupon", params, (err, data) => {
            if(err) {
              reject(err);
            }else{
              resolve(data);
            }
          });
        });
      })
      .then((result) => {
        hint.toast(result.message, 1500);
        self.checkCouponButton();
      })
      .catch(mallPromise.catchFn);
  },

  handleShareButton(e) {
    const data = $(e.currentTarget).data();
    const appName = cookie.get("appName");

    if ( /hbgj/i.test(appName) ) {
      widget.createNewView({
        url: data.hbgjUrl || data.appUrl
      });
    } else if ( /gtgj/i.test(appName) ) {
      widget.createNewView({
        url: data.gtgjUrl || data.appUrl
      });
    } else {
      widget.createNewView({
        url: data.appUrl || data.url
      });
    }
  },
  createNewPage(e) {
    widget.createAView(e);
  },
  mallInterlayer() {

    mallPromise
      .checkLogin()
      .then(userData => {
        const params = _.extend({}, userData.userInfo, {
          p: userData.deviceInfo.p,
          productid: this.urlObj.productid
        });

        return new Promise((resolve, reject) => {
          sendPost("tplProduct", params, (err, data) => {
            if(err) {
              reject(err);
            } else {
              resolve(data);
            }
          });
        });
      })
      .then( result => {
        this.$el.append(result.tpl);
        this.initActive();
        this.initCoupon();

        let shareInfo = shareUtil.getShareInfo();
        mallWechat.initShare({
          wechatshare:{
            title: shareInfo.title,
            desc: shareInfo.desc,
            link: shareInfo.link,
            img: shareInfo.imgUrl
          },
          useAppShare: true
        });

        const isApp = mallUtil.isAppFunc();

        if ( !isApp ) {
          require("app/client/mall/js/lib/download-app.js").init( isApp );
        }

        this.$initial.hide();

        sharePageLog({
          title: result.title,
          productid: this.urlObj.productid,
          hlfrom: this.urlObj.hlfrom || "--"
        });
      })
      .catch(mallPromise.catchFn);
  },

  /**
   * @param  {event} e 处理事件
   */
  createOrderDispatch(e) {
    let data = $(e.currentTarget).data();
    let params = {
      num: 1,
      productid: data.productId
    };
    return this.createOrderHanlder(params, data);
  },

  // 创建订单处理函数
  /**
   * @param {object} params 创建订单的部分请求参数
   * @param {object} data 业务处理数据
   */
  createOrderHanlder(params, data) {
    hint.showLoading();
    mallPromise
      .order(params)
      .then(orderInfo => {
        if (orderInfo === void 0) {
          return;
        }
        return this.afterCreateOrderDispatch(orderInfo, data);
      })
      .catch(err => {
        hint.hideLoading();
        if(redpacketMessage[err.code]) {
          return hint.toast(redpacketMessage[err.code], 3000);
        }
        mallPromise.catchFn(err);
      });
  },

  /**
   * @param {object} orderInfo 订单信息
   * @param {object} data 业务处理数据
   * @return {[type]}
   */
  afterCreateOrderDispatch(orderInfo, data) {
    switch(data.productType) {
      case 1:   // 领红包
        this.alert.model.set({
          title: "提示信息",
          message: data.messageSuccess
        });
        this.alert.show();
        hint.hideLoading();
        break;
      case 2:   // 支付
        this.payOrder(orderInfo);
        break;
      default:
        hint.hideLoading();
        break;
    }
  },

  // 支付已创建的订单
  payOrder(orderInfo) {
    let orderDetailUrl = `${window.location.origin}/fe/app/client/mall/html/detail-page/order-detail.html?orderid=${orderInfo.orderid}`;

    function success() {
      hint.hideLoading();
      widget.createNewView({
        url: orderDetailUrl
      });
    }

    if (String(orderInfo.paystatus) === "0" && orderInfo.payorderid) {
      orderInfo.returnUrl = orderDetailUrl;
      return mallPromise
        .initPay(orderInfo)
        .then(success);
    } else {
      return success();
    }
  },

  initActive() {
    const id = this.urlObj.productid;

    if ( String(id) === "10000212") {
      new ShareInput({ el: "#interlayer" });
    }
  }
});

new AppView();
