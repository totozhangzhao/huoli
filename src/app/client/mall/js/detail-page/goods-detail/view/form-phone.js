var $          = require("jquery");
var Backbone   = require("backbone");
var _          = require("lodash");
var async      = require("async");
var NativeAPI  = require("app/client/common/lib/native/native-api.js");
var requestAPI = require("app/client/mall/js/lib/request.js");
var toast      = require("com/mobile/widget/toast/toast.js");
var parseUrl   = require("com/mobile/lib/url/url.js").parseUrlSearch;
var appInfo    = require("app/client/mall/js/lib/appInfo.js");
var widget     = require("app/client/mall/js/lib/widget.js");
var pageAction = require("app/client/mall/js/lib/page-action.js");

// method, params, callback
var sendPost = requestAPI.createSendPost({
  url: "/bmall/rest/"
});

var validator = {
  checkPhoneNum: function(phoneNum) {
    return /^1[34578]\d{9}$/.test(phoneNum);
  },
  checkPassword: function(passwd) {
    return /^.{6,20}$/.test(passwd);
  },
  checkCaptche: function(captche) {
    return /^.{1,}$/.test(captche);
  }
};

var AppView = Backbone.View.extend({
  el: "#form-phone",
  events: {
    "click #submit"        : "createOrder",
    "input .form-input"    : "inputInput",
    "blur  .form-input"    : "blurInput",
    "input .form-phone-num": "inputPhoneNum",
    "click .js-captcha"   : "sendCaptcha",
    "click .js-use-url"   : "showOrder"
  },
  initialize: function() {
    this.$el.$shade         = $("#form-phone .js-shade");
    this.$el.$successPrompt = $("#form-phone .js-success-prompt");
    this.$el.$sendCaptcha   = $("#form-phone .js-captcha");
    this.$el.$phoneInput    = $("#form-phone .form-phone-num");
    this.$el.$passwordInput = $("#form-phone .form-password");
    this.$el.$captchaInput  = $("#form-phone .form-captcha");
  },
  inputInput: function(e) {
    $(e.currentTarget)
      .parents(".form-block")
      .find(".js-error-tip")
        .removeClass("active");
  },
  blurInput: function(e) {
    var $input = $(e.currentTarget);
    var val = $input.val();
    var method = $input.data("checkMethod");

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
  inputPhoneNum: function() {
    var phoneNum = this.$el.$phoneInput.val();

    if ( validator.checkPhoneNum(phoneNum) ) {
      this.$el.$sendCaptcha.addClass("active");
    } else {
      this.$el.$sendCaptcha.removeClass("active");
    }
  },
  sendCaptcha: function() {
    var self = this;
    var $btn = this.$el.$sendCaptcha;

    if ( !$btn.hasClass("active") ) {
      return;
    }

    var $phoneInput = this.$el.$phoneInput;

    var lock = function() {
      $phoneInput.prop("readonly", true);
      $btn.removeClass("active");
    };

    var unlock = function() {
      $phoneInput.prop("readonly", false);
      $btn.addClass("active").text("获取验证码");
    };

    lock();

    $btn.text("发送中...");

    async.waterfall([
      function(next) {
        appInfo.getUserData(function(err, userData) {
          if (err) {
            toast(err.message || "网络异常，请稍后再试", 1500);
            unlock();
            return;
          }

          next(null, userData);
        });
      },
      function(userData, next) {

        // checkPhone
        // userid：用户id
        // authcode：token
        // uid: 设备id
        // cphone：下发验证码设备
        // 返回包：
        // “ok”
        var params = _.extend({}, userData.userInfo, {
          p: userData.deviceInfo.p,
          productid: parseUrl().productid,
          cphone   : $phoneInput.val()
        });

        sendPost("checkPhone", params, function(err, data) {
          next(err, data);
        });
      }
    ], function(err) {
      if (err) {
        toast(err.message, 1500);
        unlock();
        return;
      }

      var count = $btn.data("timeout") || 90;

      self.captchaTimer = setInterval(function() {
        count -= 1;

        if (count < 0) {
          clearInterval(self.captchaTimer);
          unlock();
          return;
        }

        $btn.text(count + "s后重新发送");
      }, 1000);
    });
  },
  createOrder: function() {
    var self = this;

    this.$el.find(".form-input").trigger("blur");

    if (this.$el.find(".error-tip.active").length > 0) {
      toast("请输入正确的信息", 1500);
      return;
    }

    async.waterfall([
      function(next) {
        appInfo.getUserData(function(err, userData) {
          if (err) {
            toast(err.message, 1500);
            return;
          }

          next(null, userData);
        });
      },
      function(userData, next) {

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
        var params = _.extend({}, userData.userInfo, {
          p: userData.deviceInfo.p,
          productid: parseUrl().productid,
          cphone  : self.$el.$phoneInput.val(),
          passwd  : self.$el.$passwordInput.val(),
          identify: self.$el.$captchaInput.val()
        });

        sendPost("createPhoneUser", params, function(err, data) {
          next(err, data);
        });
      }
    ], function(err, result) {
      if (err) {
        toast(err.message, 1500);
        return;
      }

      self.$el.$shade.show();
      self.$el.$successPrompt
        .one("click", ".js-goto-order-detail", function() {
          window.location.href = "/fe/app/client/mall/html/detail-page/order-detail.html" +
            "?orderid=" + result.orderid;
        })
        .one("click", ".js-goto-url", function() {
          window.location.href = result.useurl;
        })
        .find(".js-message")
          .html(result.message)
        .end()
        .show();
    });
  },
  showOrder: function() {
    this.$el.$shade.hide();
    this.$el.$successPrompt.hide();
  },
  createNewPage: function(e) {
    widget.createAView(e);
  },
  renderMainPanel: function() {
    var self = this;
    var productInfo = this.cache.productInfo;

    var $img = $("<img>", {
      src: productInfo.img,
      alt: ""
    });

    $("#form-phone-main-image").html($img);

    // set phone number from getUserInfo
    async.waterfall([
      function(next) {
        appInfo.getUserData(function(err, userData) {
          next(err, userData);
        });
      },
    ], function(err, result) {
      if (err) {
        return;
      }

      var phoneNum = result.userInfo.phone || "";

      if (phoneNum) {
        self.$el.$phoneInput
          .val(phoneNum)
          .trigger("blur");

        self.$el.$sendCaptcha
          .addClass("active");
      }
    });
  },
  updateNativeView: function(title) {
    NativeAPI.invoke("updateTitle", {
      text: title
    });
  },
  init: function(options) {
    if (options.previousView !== "goods-detail") {
      NativeAPI.invoke("close");
      return;
    }
    this.updateNativeView("现金券兑换");
    this.renderMainPanel();
    pageAction.setClose();
  }
});

module.exports = AppView;
