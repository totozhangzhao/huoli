import $           from "jquery";
import _           from "lodash";
import Backbone    from "backbone";
import {sendPost}  from "app/client/mall/js/lib/mall-request.js";
import UrlUtil     from "com/mobile/lib/url/url.js";
import wechatUtil  from "com/mobile/widget/wechat-hack/util.js";
import validator   from "app/client/mall/js/lib/validator.js";
import cookie      from "com/mobile/lib/cookie/cookie.js";
import mallUitl    from "app/client/mall/js/lib/util.js";
import logger      from "com/mobile/lib/log/log.js";
import tmpl        from "app/client/mall/tpl/login/login.tpl";
// import {toast}     from "com/mobile/widget/hint/hint.js";
import * as loginUtil   from "app/client/mall/js/lib/login-util.js";
import * as mallPromise from "app/client/mall/js/lib/mall-promise.js";
import "app/client/mall/js/lib/common.js";

var AppView = Backbone.View.extend({
  el: "#login-main",
  events: {
    "input .js-phone-num": "inputPhoneNum",
    "click .js-captcha-button": "sendCaptcha",
    "click .js-login": "login"
  },
  initialize(commonData) {
    _.extend(this, commonData);
    logger.track(mallUitl.getAppName() + "PV", "View PV", document.title);
    this.urlObj = UrlUtil.parseUrlSearch();
    // if isWechat then
    if ( wechatUtil.isWechatFunc() && !this.urlObj.openid ) {
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
  inputPhoneNum: function() {
    var phoneNum = this.$el.$phoneInput.val();

    if ( validator.checkPhoneNum(phoneNum) ) {
      this.$el.$captchaButton.prop("disabled", false);
    } else {
      this.$el.$captchaButton.prop("disabled", true);
    }
  },
  sendCaptcha: function() {
    var $btn = this.$el.$captchaButton;

    if ( $btn.prop("disabled") ) {
      return;
    }

    var $phoneInput = this.$el.$phoneInput;

    var lock = function() {
      $phoneInput.prop("readonly", true);
      $btn.prop("disabled", true);
    };

    var unlock = function() {
      $phoneInput.prop("readonly", false);
      $btn.prop("disabled", false).text("获取验证码");
    };

    lock();

    $btn.text("发送中...");

    new Promise((resovle, reject) => {
      var params = {
        phone: $phoneInput.val()
      };
      sendPost("sendLoginCode", params, function(err, data) {
        if (err) {
          reject(err);
        } else {
          resovle(data);
        }
      });
    })
      .then(() => {
        var count = $btn.data("timeout") || 90;

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
    let phone = this.$el.$phoneInput.val();
    new Promise((resovle, reject) => {
      let openid = this.urlObj.openid;
      let params = {
        phone: phone,
        code: this.$el.$captchaInput.val()
      };

      if (openid) {
        params.openid = openid;
      }

      sendPost("weixinLogin", params, (err, data) => {
        if (err) {
          reject(err);
        } else {
          resovle(data);
        }
      });
    })
      .then(data => {
        let cookieConfig = {
          expires: 86400,
          domain: location.hostname,
          path: "/"
        };
        cookie.set("token", data.token, cookieConfig);
        cookie.set("points", data.points, cookieConfig);
        cookie.set("level", data.level, cookieConfig);
        cookie.set("phone", phone, cookieConfig);
      })
      .then(() => {
        window.location.href = "/fe/app/client/mall/index.html";
      })
      .catch(mallPromise.catchFn);
  }
});

new AppView();
