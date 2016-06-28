import $           from "jquery";
import _           from "lodash";
import Backbone    from "backbone";
import {sendPost}  from "app/client/mall/js/lib/mall-request.js";
import UrlUtil     from "com/mobile/lib/url/url.js";
import validator   from "app/client/mall/js/lib/validator.js";
import * as mallUitl    from "app/client/mall/js/lib/util.js";
import logger      from "com/mobile/lib/log/log.js";
import tmpl        from "app/client/mall/tpl/login/login.tpl";
import * as loginUtil   from "app/client/mall/js/lib/login-util.js";
import * as mallPromise from "app/client/mall/js/lib/mall-promise.js";
import {toast} from "com/mobile/widget/hint/hint.js";
import BackTop from "com/mobile/widget/button/to-top.js";
import * as widget from "app/client/mall/js/lib/common.js";

const AppView = Backbone.View.extend({
  el: "#login-main",
  events: {
    "input .js-phone-num"     : "inputPhoneNum",
    "input .js-input"         : "inputInput",
    "blur  .js-input"         : "blurInput",
    "click .js-captcha-button": "sendCaptcha",
    "click .js-login"         : "login"
  },
  initialize(commonData) {
    new BackTop();
    _.extend(this, commonData);
    logger.track(mallUitl.getAppName() + "PV", "View PV", document.title);
    this.urlObj = UrlUtil.parseUrlSearch();
    if ( loginUtil.shouldGetWeChatKey() ) {
      window.location.href = loginUtil.getWechatAuthUrl();
      return;
    }
    this.render();
  },
  resume() {
  },
  render() {
    this.$el.html(tmpl({}));
    this.$el.$phoneInput    = $("#login-main .js-phone-num");
    this.$el.$captchaInput  = $("#login-main .js-captcha");
    this.$el.$captchaButton = $("#login-main .js-captcha-button");
  },
  inputPhoneNum() {
    let phoneNum = this.$el.$phoneInput.val();

    if ( validator.checkPhoneNum(phoneNum) ) {
      this.$el.$captchaButton.prop("disabled", false);
    } else {
      this.$el.$captchaButton.prop("disabled", true);
    }
  },
  inputInput: function(e) {
    $(e.currentTarget).removeClass("js-input-error");
  },
  blurInput: function(e) {
    var $input = $(e.currentTarget);
    var val = $input.val();
    var method = $input.data("checkMethod");

    if ( validator[method](val) ) {
      $input.removeClass("js-input-error");
    } else {
      $input.addClass("js-input-error");
    }
  },
  sendCaptcha() {
    let $btn = this.$el.$captchaButton;

    if ( $btn.prop("disabled") ) {
      return;
    }

    let $phoneInput = this.$el.$phoneInput;

    function lock() {
      $phoneInput.prop("readonly", true);
      $btn.prop("disabled", true);
    }

    function unlock() {
      $phoneInput.prop("readonly", false);
      $btn.prop("disabled", false).text("获取验证码");
    }

    lock();

    $btn.text("发送中...");

    new Promise((resovle, reject) => {
      let params = {
        phone: $phoneInput.val()
      };
      sendPost("sendLoginCode", params, (err, data) => {
        if (err) {
          reject(err);
        } else {
          resovle(data);
        }
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
  login() {
    this.$el.find(".js-input").trigger("blur");

    if (this.$el.find(".js-input-error").length > 0) {
      toast("请输入正确的登录信息", 1500);
      return;
    }

    if (this.loginLock) {
      return;
    } else {
      this.loginLock = true;
    }

    loginUtil.loginRequset({
      phone: this.$el.$phoneInput.val(),
      captcha: this.$el.$captchaInput.val(),
      wechatKey: this.urlObj.wechatKey
    })
      .then(data => {
        if (!data) {
          return;
        }
        widget.replacePage("/fe/app/client/mall/index.html");
      })
      .catch(mallPromise.catchFn)
      .then(() => {
        setTimeout(() => {
          this.loginLock = false;
        }, 300);
      });
  }
});

new AppView();
