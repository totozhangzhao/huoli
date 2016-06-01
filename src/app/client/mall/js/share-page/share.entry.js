import $ from "jquery";
import Backbone from "backbone";
import _ from "lodash";
import async from "async";
import * as mallPromise from "app/client/mall/js/lib/mall-promise.js";
import {sendPost} from "app/client/mall/js/lib/mall-request.js";
import {toast} from "com/mobile/widget/hint/hint.js";
import {parseUrlSearch as parseUrl} from "com/mobile/lib/url/url.js";
import appInfo from "app/client/mall/js/lib/app-info.js";
import * as widget from "app/client/mall/js/lib/common.js";
import loadScript from "com/mobile/lib/load-script/load-script.js";
import cookie from "com/mobile/lib/cookie/cookie.js";
import shareUtil from "com/mobile/widget/wechat/util.js";
import wechatUtil from "com/mobile/widget/wechat-hack/util.js";
import mallWechat from "app/client/mall/js/lib/wechat.js";
import logger from "com/mobile/lib/log/log.js";
import mallUitl from "app/client/mall/js/lib/util.js";
import ShareInput from "app/client/mall/js/share-page/share-input.js";
import ui from "app/client/mall/js/lib/ui.js";

const AppView = Backbone.View.extend({
  el: "#interlayer",
  events: {
    "click .js-get-coupon": "getMallCoupon",
    "click .js-common-share": "handleShareButton",
    "click a": "createNewPage"
  },
  initialize() {
    this.$initial = ui.initial().show();
    this.mallInterlayer();
    logger.track(`${mallUitl.getAppName()}PV`, "View PV", document.title);
  },

  initCoupon() {
    this.$getCouponButton = this.$el.find(".js-get-coupon");
    this.couponId = this.$getCouponButton.data("couponId");
    this.checkCouponButton();
  },

  checkCouponButton() {
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
          productid: self.couponId
        });

        window.console.log(params);
        sendPost("getUserCouponStat", params, (err, data) => {
          next(err, data);
        });
      }
    ], (err, result) => {
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
      if (err) {
        if(err.code === -3330) {
          window.console.log(111);
          mallPromise.login();
          return;
        }
        return toast(err.message, 1500);
      }
      switch(result.code) {
        case 1:
          self.$getCouponButton.addClass("active");
          break;
        case -601:
        case -602:
        case -104:
        case -103:
        case -114:
        case -113:
        case -115:
        case -116:
        case -3330:
        default: {
          self.$getCouponButton.removeClass("active");
          break;
        }
      }
    });

  },

  getMallCoupon() {
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
          productid: self.couponId
        });

        sendPost("getCoupon", params, (err, data) => {
          next(err, data);
        });
      }
    ], (err, result) => {
      if (err) {
        toast(err.message, 1500);
        return;
      }

      toast(result.message, 1500);
      self.checkCouponButton();
    });
  },
  handleShareButton(e) {
    const urlObj = $(e.currentTarget).data();
    const appName = cookie.get("appName");

    if ( /hbgj/i.test(appName) ) {
      widget.createNewView({
        url: urlObj.hbgjUrl || urlObj.appUrl
      });
    } else if ( /gtgj/i.test(appName) ) {
      widget.createNewView({
        url: urlObj.gtgjUrl || urlObj.appUrl
      });
    } else if ( wechatUtil.isWechatFunc() ) {
      window.location.href = urlObj.wechatUrl || urlObj.weixinUrl || urlObj.webUrl;
    } else {
      widget.createNewView({
        url: urlObj.webUrl || urlObj.url
      });
    }
  },
  createNewPage(e) {
    widget.createAView(e);
  },
  mallInterlayer() {
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
          productid: parseUrl().productid
        });

        sendPost("tplProduct", params, (err, data) => {
          next(err, data);
        });
      }
    ], (err, result) => {
      if (err) {
        toast(err.message, 1500);
        return;
      }

      self.$el.append(result.tpl);
      self.initActive();
      self.initCoupon();

      if ( wechatUtil.isWechatFunc() ) {
        wechatUtil.setTitle(result.title);
        if ( shareUtil.hasShareInfo() ) {
          loadScript(`${window.location.origin}/fe/com/mobile/widget/wechat/wechat.bundle.js`);
        }
      } else {
        widget.updateViewTitle(result.title);
        if ( shareUtil.hasShareInfo() ) {
          mallWechat.initNativeShare();
        }
      }

      const isApp = mallUitl.isAppFunc();

      if ( !isApp ) {
        require("app/client/mall/js/lib/download-app.js").init( isApp );
      }

      self.$initial.hide();
    });
  },
  initActive() {
    const id = parseUrl().productid;

    if ( String(id) === "10000212") {
      new ShareInput({ el: "#interlayer" });
    }
  }
});

new AppView();
