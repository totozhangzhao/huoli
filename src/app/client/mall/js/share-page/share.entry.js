import $ from "jquery";
import Backbone from "backbone";
import _ from "lodash";
import async from "async";
import * as mallPromise from "app/client/mall/js/lib/mall-promise.js";
import {sendPost} from "app/client/mall/js/lib/mall-request.js";
import {toast} from "com/mobile/widget/hint/hint.js";
import UrlUtil from "com/mobile/lib/url/url.js";
import appInfo from "app/client/mall/js/lib/app-info.js";
import loadScript from "com/mobile/lib/load-script/load-script.js";
import cookie from "com/mobile/lib/cookie/cookie.js";
import shareUtil from "com/mobile/widget/wechat/util.js";
import wechatUtil from "com/mobile/widget/wechat-hack/util.js";
import * as mallWechat from "app/client/mall/js/lib/wechat.js";
import logger from "com/mobile/lib/log/log.js";
import * as mallUitl from "app/client/mall/js/lib/util.js";
import ShareInput from "app/client/mall/js/share-page/share-input.js";
import ui from "app/client/mall/js/lib/ui.js";
import BackTop from "com/mobile/widget/button/to-top.js";
import * as loginUtil from "app/client/mall/js/lib/login-util.js";
import Navigator from "app/client/mall/js/common/views/header/navigator.js";
import * as widget from "app/client/mall/js/lib/common.js";

const sharePageLog = widget.initTracker("ad");

const AppView = Backbone.View.extend({
  el: "#interlayer",
  events: {
    "click .js-get-coupon": "getMallCoupon",
    "click .btn-get-coupon": "getCoupon",
    "click .js-common-share": "handleShareButton",
    "click a": "createNewPage"
  },
  initialize() {
    const nav = new Navigator();
    nav.render();
    new BackTop();
    this.urlObj = UrlUtil.parseUrlSearch();
    this.$initial = ui.initial().show();
    this.mallInterlayer();
    logger.track(`${mallUitl.getAppName()}PV`, "View PV", document.title);
  },

  initCoupon() {
    this.$getCouponButton = this.$el.find(".js-get-coupon");
    if( this.$getCouponButton.length >0) {
      this.couponId = this.$getCouponButton.data("couponId");
      this.checkCouponButton();
    }
  },

  checkCouponButton(couponId) {
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
          productid: couponId || self.couponId
        });

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
          loginUtil.login();
          return;
        }
        return toast(err.message, 1500);
      }
      switch(result.code) {
        case -602:
          self.$getCouponButton.removeClass("active");
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
          self.$getCouponButton.addClass("active");
          break;
        }
      }
    });

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
        toast(result.message, 1500);
        self.checkCouponButton();
      })
      .catch(mallPromise.catchFn);
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
    //       productid: couponId
    //     });

    //     sendPost("getCoupon", params, (err, data) => {
    //       next(err, data);
    //     });
    //   }
    // ], (err, result) => {
    //     // self.curCouponBtn.text("已领取优惠券");
    //     // self.curCouponBtn.addClass('active');
    //   if (err) {
    //     toast(err.message, 1500);
    //     return;
    //   }
    //   toast(result.message, 1500);
    //   self.checkCouponButton();
    // });
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
          productid: this.urlObj.productid
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
        if ( shareUtil.hasShareHtml() ) {
          loadScript(`${window.location.origin}/fe/com/mobile/widget/wechat/wechat.bundle.js`);
        }
      } else {
        widget.updateViewTitle(result.title);
        if ( shareUtil.hasShareHtml() ) {
          mallWechat.initNativeShare();
        }
      }

      const isApp = mallUitl.isAppFunc();

      if ( !isApp ) {
        require("app/client/mall/js/lib/download-app.js").init( isApp );
      }

      self.$initial.hide();

      sharePageLog({
        title: result.title,
        productid: this.urlObj.productid,
        hlfrom: this.urlObj.hlfrom || "--"
      });
    });
  },
  initActive() {
    const id = this.urlObj.productid;

    if ( String(id) === "10000212") {
      new ShareInput({ el: "#interlayer" });
    }
  }
});

new AppView();
