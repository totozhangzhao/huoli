var $          = require("jquery");
var _          = require("lodash");
var Backbone   = require("backbone");
var async      = require("async");
var appInfo    = require("app/client/mall/js/lib/app-info.js");
var sendPost   = require("app/client/mall/js/lib/mall-request.js").sendPost;
var toast      = require("com/mobile/widget/hint/hint.js").toast;
var parseUrl   = require("com/mobile/lib/url/url.js").parseUrlSearch;
var validator  = require("app/client/mall/js/lib/validator.js");
var NativeAPI  = require("app/client/common/lib/native/native-api.js");
var widget     = require("app/client/mall/js/lib/common.js");

var idMap = {
  "10000184": 1001014,
  "22000003": 2000281
};

var AppView = Backbone.View.extend({
  events: {
    "click input.send-info": "handleMainSubmit"
  },
  initialize: function() {
    this.$panel = this.$el.find(".js-success-alert");
    this.initView();
  },
  initView: function() {
    var self = this;

    async.waterfall([
      function(next) {
        appInfo.getUserData(function(err, userData) {
          if (err) {
            next(err);
            return;
          }

          next(null, userData.userInfo.phone);
        });
      }
    ], function(err, phone) {
      if (err) {
        toast(err.message, 1500);
        return;
      }

      self.$el.find("input.insert-tel").val(phone);
    });
  },
  closePanel: function() {
    this.$panel.hide();
  },
  handleMainSubmit: function() {
    var self = this;
    var phone = this.$el.find("input.insert-tel").val();

    if ( !validator.checkPhoneNum(phone) ) {
      toast("请输入正确的手机号", 1500);
      return;
    }

    var list = [];

    var $radio = $("input[type='radio']:checked");

    if ( $radio.length > 0 ) {
      $radio.each(function() {
        var q = $(this)
            .parents(".pin-chocicebar")
            .find("> :nth-child(1)")
              .text();
        var a = $(this)
            .siblings("span")
            .text();
        list.push({
          q: q,
          a: a
        });
      });
    }

    var $checkbox = $("input[type='checkbox']:checked");

    if ( $checkbox.length > 0 ) {
      $checkbox.each(function() {
        var q = $(this)
            .parents(".pin-chocicebar")
            .find("> :nth-child(1)")
              .text();
        var a = $(this)
            .siblings("span")
            .text();
        list.push({
          q: q,
          a: a
        });
      });
    }

    // console.log(JSON.stringify(list));

    if ( list.length < 1 ) {
      toast("请您选择答案", 1500);
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
        // productid: 虚拟产品id
        // input {{}, {}, ...}
        // 返回包
        // orderid: 订单id
        // message: 显示信息
        // useurl: 第三方url
        var params = _.extend({}, userData.userInfo, {
          p: userData.deviceInfo.p,
          productid: idMap[parseUrl().productid],
          input: {
            phone: phone,
            list: list
          }
        });

        sendPost("createOrder", params, function(err, data) {
          next(err, data);
        });
      }
    ], function(err, orderInfo) {
      if (err) {
        toast(err.message, 1500);
        return;
      }

      var orderDetailUrl = window.location.origin +
          "/fe/app/client/mall/html/detail-page/order-detail.html" +
          "?orderid=" + orderInfo.orderid;

      self.gotoNewView({
        url: orderDetailUrl
      });
    });
  },
  gotoNewView: function(options) {
    widget.createNewView(options);
  },
  loginApp: function() {
    async.waterfall([
      function(next) {

        // window.location.href = "gtgj://?type=gtlogin&bindflag=1&callback=" +
        //   window.btoa(unescape(encodeURIComponent( window.location.href )));

        NativeAPI.invoke("login", null, function(err, data) {
          next(err, data);
        });
      }
    ], function(err, result) {
      if (err) {
        toast(err.message, 1500);
        return;
      }

      if ( String(result.succ) === "1" || result.value === result.SUCC ) {
        window.location.reload();
      } else {
        // hint.hideLoading();
        window.console.log(JSON.stringify(result));
        NativeAPI.invoke("close");
      }
    });
  }
});

module.exports = AppView;
