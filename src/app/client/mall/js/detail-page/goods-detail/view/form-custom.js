var $          = require("jquery");
var Backbone   = require("backbone");
var _          = require("lodash");
var async      = require("async");
var NativeAPI  = require("app/client/common/lib/native/native-api.js");
var sendPost   = require("app/client/mall/js/lib/mall-request.js").sendPost;
var toast      = require("com/mobile/widget/hint/hint.js").toast;
var parseUrl   = require("com/mobile/lib/url/url.js").parseUrlSearch;
var appInfo    = require("app/client/mall/js/lib/app-info.js");
var pageAction = require("app/client/mall/js/lib/page-action.js");
var validator  = require("app/client/mall/js/lib/validator.js");
var hint       = require("com/mobile/widget/hint/hint.js");
var detailLog  = require("app/client/mall/js/lib/common.js").initTracker("detail");

var AppView = Backbone.View.extend({
  el: "#form-custom",
  events: {
    "click .js-submit"    : "createOrder",
    "input .js-form-input": "inputInput",
    "blur  .js-form-input": "blurInput"
  },
  initialize: function(commonData) {
    _.extend(this, commonData);
    this.$el.$shade         = this.$el.find(".js-shade");
    this.$el.$successPrompt = this.$el.find(".js-success-prompt");
  },
  resume: function(opts) {
    if (opts.previousView !== "goods-detail") {
      NativeAPI.invoke("close");
      return;
    }
    this.renderMainPanel();
    pageAction.setClose();
    detailLog({
      title: window.document.title + "form-custom",
      productid: parseUrl().productid,
      from: parseUrl().from || "--"
    });
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

    // 1.realname-icon:name  : 姓名
    // 2.idcard-icon  :idcard: 身份证号
    // 3.phone-icon   :phone : 手机号
    // 4.psw-icon     :pwd   : 输入密码
    // 5.re-psw-icon  :repwd : 再次输入密码
    // 6.email-icon   :email : 邮箱
    var checkMethods = {
      email: "checkEmail",
      phone: "checkPhoneNum",
      pwd  : "checkPassword",
      captche: "checkCaptche"
    };

    var method = checkMethods[$input.data("validateType")];

    if (
      ( !validator[method] && val !== "" ) ||
      ( validator[method] && validator[method](val) )
    ) {
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
  renderMainPanel: function() {
    var self = this;
    var goods = this.cache.goods;

    var $img = $("<img>", {
      src: goods.img,
      alt: ""
    });

    this.$el.find(".js-top-image").html($img);

    var tmpl = require("app/client/mall/tpl/detail-page/form-custom.tpl");

    // 1.realname-icon:name  : 姓名
    // 2.idcard-icon  :idcard: 身份证号
    // 3.phone-icon   :phone : 手机号
    // 4.psw-icon     :pwd   : 输入密码
    // 5.re-psw-icon  :repwd : 再次输入密码
    // 6.email-icon   :email : 邮箱
    var inputClass = {
      name  : "realname-icon",
      idcard: "idcard-icon",
      phone : "phone-icon",
      pwd   : "psw-icon",
      repwd : "re-psw-icon",
      email : "email-icon"
    };

    this.$el
      .find(".js-input-container")
        .html(tmpl({
          list: goods.input,
          inputClass: inputClass
        }));

    // set phone number from getUserInfo
    async.waterfall([
      function(next) {
        appInfo.getUserData(function(err, userData) {
          next(err, userData);
        });
      }
    ], function(err, result) {
      if (err) {
        return;
      }

      var phoneNum = result.userInfo.phone || "";

      if (phoneNum) {
        self.$el.find(".js-form-input")
          .find("[name=phone]")
          .val(phoneNum)
          .trigger("blur");
      }
    });
  },
  createOrder: function() {
    var $inputs = this.$el.find(".js-form-input");

    $inputs.trigger("blur");

    if (this.$el.find(".error-tip.active").length > 0) {
      toast("请输入正确的信息", 1500);
      return;
    }

    hint.showLoading();

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
        var inputList = {};

        $inputs.each(function(index, item) {
          inputList[item.name] = item.value;
        });

        // createPhoneUser
        // uid: 设备id
        // userid: 用户id
        // authcode: token
        // productid: 产品id
        // input {{}, {}, ...}
        // 返回包
        // orderid: 订单id
        // message: 显示信息
        // useurl: 第三方url
        var params = _.extend({}, userData.userInfo, {
          p: userData.deviceInfo.p,
          productid: parseUrl().productid,
          input: inputList
        });

        sendPost("createOrder", params, function(err, data) {
          next(err, data);
        });
      }
    ], function(err, result) {
      if (err) {
        toast(err.message, 1500);
        return;
      }

      // hint.hideLoading();
      window.location.href = "/fe/app/client/mall/html/detail-page/order-detail.html" +
        "?orderid=" + result.orderid;
    });
  }
});

module.exports = AppView;
