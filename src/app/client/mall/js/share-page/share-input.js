// var $          = require("jquery");
var _          = require("lodash");
var Backbone   = require("backbone");
var async      = require("async");
var appInfo    = require("app/client/mall/js/lib/app-info.js");
var sendPost   = require("app/client/mall/js/lib/mall-request.js").sendPost;
var toast      = require("com/mobile/widget/hint/hint.js").toast;
var parseUrl   = require("com/mobile/lib/url/url.js").parseUrlSearch;
var validator  = require("app/client/mall/js/lib/validator.js");
var NativeAPI  = require("app/client/common/lib/native/native-api.js");

var getMoney = function(points) {
  points = Number(points) || 0;

  var maxMoney = 200000;
  var minMoney = 10000;

  if (points < minMoney) {
    return minMoney;
  } else if (points > maxMoney) {
    return maxMoney;
  } else {
    return points;
  }
};

var AppView = Backbone.View.extend({

  // 用户积分
  // js-points

  // 可领取 XXX 元
  // js-money

  // 手机号 input
  // js-phone-input

  // 领取按钮
  // js-main-button

  // 领取成功弹窗
  // js-success-alert

  // 关闭弹窗
  // js-close
  events: {
    "click .js-main-button": "handleMainSubmit",
    "click .js-close"      : "closePanel"
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

          next(null, userData);
        });
      },
      function(userData, next) {
        if (userData.userInfo && userData.userInfo.userid) {
          var params = _.extend({}, userData.userInfo, {
            p: userData.deviceInfo.p
          });

          sendPost("getUserInfo", params, function(err, data) {
            if (err) {
              next(err);
              return;
            }

            next(null, data);
          });
        } else {
          self.loginApp();
        }
      }
    ], function(err, result) {
      if (err) {
        toast(err.message, 1500);
        return;
      }

      var points = result.points;

      self.$el
        .find(".js-points")
          .text(points)
        .end()
        .find(".js-money")
          .text(getMoney(points));
    });
  },
  closePanel: function() {
    this.$panel.hide();
  },
  handleMainSubmit: function() {
    var self = this;
    var phone = this.$el.find(".js-phone-input").val();

    if ( !validator.checkPhoneNum(phone) ) {
      toast("请输入正确的手机号", 1500);
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
        // input {{}, {}, ...}
        // 返回包
        // orderid: 订单id
        // message: 显示信息
        // useurl: 第三方url
        var params = _.extend({}, userData.userInfo, {
          p: userData.deviceInfo.p,
          productid: parseUrl().productid,
          input: {
            phone: phone
          }
        });

        sendPost("createOrder", params, function(err, data) {
          next(err, data);
        });
      }
    ], function(err) {
      if (err) {
        toast(err.message, 1500);
        return;
      }

      self.$panel
        .find(".js-phone")
          .text( phone.slice(0, 3) + "****" + phone.slice(7, 11) )
        .end()
        .show();
    });
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
