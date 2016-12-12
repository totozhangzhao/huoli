import $ from "jquery";
import Backbone from "backbone";
import _ from "lodash";
import NativeAPI from "app/client/common/lib/native/native-api.js";
import {sendPost} from "app/client/mall/js/lib/mall-request.js";
import {toast} from "com/mobile/widget/hint/hint.js";
import {parseUrlSearch as parseUrl} from "com/mobile/lib/url/url.js";
import pageAction from "app/client/mall/js/lib/page-action.js";
import validator from "app/client/mall/js/lib/validator.js";
import * as mallPromise from "app/client/mall/js/lib/mall-promise.js";
import * as widget from "app/client/mall/js/lib/common.js";
import {initTracker} from "app/client/mall/js/lib/common.js";

const detailLog = initTracker("detail");

const AppView = Backbone.View.extend({
  el: "#form-phone",
  events: {
    "click .js-submit"     : "createOrder",
    "input .form-input"    : "inputInput",
    "blur  .form-input"    : "blurInput",
    "input .form-phone-num": "inputPhoneNum",
    "click .js-captcha"    : "sendCaptcha",
    "click .js-use-url"    : "showOrder"
  },
  initialize(commonData) {
    _.extend(this, commonData);
    this.$el.$shade         = $("#form-phone .js-shade");
    this.$el.$successPrompt = $("#form-phone .js-success-prompt");
    this.$el.$sendCaptcha   = $("#form-phone .js-captcha");
    this.$el.$phoneInput    = $("#form-phone .form-phone-num");
    this.$el.$passwordInput = $("#form-phone .form-password");
    this.$el.$captchaInput  = $("#form-phone .form-captcha");
  },
  resume(opts) {
    if (opts.previousView !== "goods-detail") {
      NativeAPI.invoke("close");
      return;
    }

    let title = "现金券兑换";

    widget.updateViewTitle(title);
    this.renderMainPanel();
    pageAction.setClose();
    detailLog({
      title,
      productid: parseUrl().productid,
      hlfrom: parseUrl().hlfrom || "--"
    });
  },
  inputInput(e) {
    $(e.currentTarget)
      .parents(".form-block")
      .find(".js-error-tip")
        .removeClass("active");
  },
  blurInput(e) {
    let $input = $(e.currentTarget);
    let val = $input.val();
    let method = $input.data("checkMethod");

    if ( validator[method](val) ) {
      $input
        .parents(".form-block")
        .find(".js-error-tip")
          .removeClass("active");
    } else {
      $input
        .parents(".form-block")
        .find(".js-error-tip")
          .addClass("active");
    }
  },
  inputPhoneNum() {
    let phoneNum = this.$el.$phoneInput.val();

    if ( validator.checkPhoneNum(phoneNum) ) {
      this.$el.$sendCaptcha.addClass("active");
    } else {
      this.$el.$sendCaptcha.removeClass("active");
    }
  },
  sendCaptcha() {
    let $btn = this.$el.$sendCaptcha;

    if ( !$btn.hasClass("active") ) {
      return;
    }

    let $phoneInput = this.$el.$phoneInput;

    function lock() {
      $phoneInput.prop("readonly", true);
      $btn.removeClass("active");
    }
    function unlock() {
      $phoneInput.prop("readonly", false);
      $btn.addClass("active").text("获取验证码");
    }

    lock();

    $btn.text("发送中...");

    mallPromise
      .getAppInfo()
      .then(userData => {

        // checkPhone
        // userid：用户id
        // authcode：token
        // uid: 设备id
        // cphone：下发验证码设备
        // 返回包：
        // “ok”
        let params = _.extend({}, userData.userInfo, {
          p: userData.deviceInfo.p,
          productid: parseUrl().productid,
          cphone   : $phoneInput.val()
        });

        return new Promise((resolve, reject) => {
          sendPost("checkPhone", params, (err, data) => {
            if (err) {
              reject(err);
            } else {
              resolve(data);
            }
          });
        });
      })
      .then(() => {
        let count = $btn.data("timeout") || 90;

        this.captchaTimer = setInterval(() => {
          count -= 1;

          if (count < 0) {
            clearInterval(this.captchaTimer);
            unlock();
            return;
          }

          $btn.text(count + "s后重发");
        }, 1000);
      })
      .catch(err => {
        unlock();
        mallPromise.catchFn(err);
      });
  },
  createOrder() {
    this.$el.find(".form-input").trigger("blur");

    if (this.$el.find(".error-tip.active").length > 0) {
      toast("请输入正确的信息", 1500);
      return;
    }

    if (this.createOrderLock) {
      return;
    } else {
      this.createOrderLock = true;
    }

    mallPromise
      .getAppInfo()
      .then(userData => {

        // createPhoneUser
        // uid: 设备id
        // userid: 用户id
        // authcode: token
        // productid: 产品id
        // cphone: 下发验证码设备
        // passwd: 用户设置的passwd
        // identify: 用户填写验证码
        // 返回包
        // orderid: 订单id
        // message: 显示信息
        // useurl: 第三方url
        let params = _.extend({}, userData.userInfo, {
          goodspecid: this.model.buyNumModel.get("specValueId"),
          num: this.model.buyNumModel.get("number"),
          p: userData.deviceInfo.p,
          productid: parseUrl().productid,
          cphone  : this.$el.$phoneInput.val(),
          passwd  : this.$el.$passwordInput.val(),
          identify: this.$el.$captchaInput.val()
        });

        return new Promise((resolve, reject) => {
          sendPost("createOrder", params, (err, data) => {
            if (err) {
              reject(err);
            } else {
              resolve(data);
            }
          });
        });
      })
      .then(result => {
        this.$el.$shade.show();
        this.$el.$successPrompt
          .one("click", ".js-goto-order-detail", () => {
            window.location.href = `/fe/app/client/mall/html/detail-page/order-detail.html?orderid=${result.orderid}`;
          })
          .one("click", ".js-goto-url", () => {
            window.location.href = result.useurl;
          })
          .find(".js-message")
            .html(result.message)
          .end()
          .show();
      })
      .catch(mallPromise.catchFn)
      .then(() => {
        setTimeout(() => {
          this.createOrderLock = false;
        }, 300);
      });
  },
  showOrder() {
    this.$el.$shade.hide();
    this.$el.$successPrompt.hide();
  },
  createNewPage(e) {
    widget.createAView(e);
  },
  renderMainPanel() {
    let self = this;
    let goods = this.cache.goods;

    let $img = $("<img>", {
      src: goods.img[0],
      alt: ""
    });

    this.$el.find(".js-top-image").html($img);

    function setPhone(phoneNum = "") {
      if (phoneNum) {
        self.$el.$phoneInput
          .val(phoneNum)
          .trigger("blur");

        self.$el.$sendCaptcha
          .addClass("active");
      }
    }

    // set phone number from getUserInfo
    mallPromise
      .getAppInfo()
      .then(userData => {
        setPhone(userData.userInfo.phone);
      })
      .catch(() => {
        setPhone();
      });
  }
});

export default AppView;
