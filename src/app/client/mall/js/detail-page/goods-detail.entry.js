var $         = require("jquery");
var Backbone  = require("backbone");
var _         = require("lodash");
var async     = require("async");
var NativeAPI = require("app/client/common/lib/native/native-api.js");
var requestAPI = require("app/client/mall/js/lib/request.js");
var toast = require("com/mobile/widget/toast/toast.js");
var parseUrl  = require("com/mobile/lib/url/url.js").parseUrlSearch;

// method, params, callback
var sendPost = requestAPI.createSendPost({
  url: "/bmall/rest/"
});

var DEVICE_INFO = {};
var USER_INFO   = {};

var AppView = Backbone.View.extend({
  el: "body",
  initialize: function() {
    NativeAPI.invoke("updateTitle", {
      text: "商品详情"
    });

    this.$el.$shade          = $(".js-shade");
    this.$el.$exchangeButton = $(".js-exchange-button");
    this.$el.$promptBoard    = $(".js-exchange-prompt");
    this.$el.$promptSuccess  = $(".js-success-prompt");
    this.$el.$promptFail     = $(".js-fail-prompt");
    
    this.mallOrderDetail();
  },
  mallOrderDetail: function() {
    var self = this;

    async.auto({
      deviceInfo: function(next) {
        NativeAPI.invoke("getDeviceInfo", null, function(err, data) {
          if (err) {
            next(null, {
              name: "gtgj"
            });
            return;
          }

          next(null, data);
        });
      },
      userInfo: function(next) {
        NativeAPI.invoke("getUserInfo", null, function(err, data) {
          if (err) {
            next(err);
            return;
          }

          if (_.isObject(data) && !data.authcode) {
            NativeAPI.invoke("login", null, function() {});
            return;
          }

          next(null, data);
        });
      },
      productDetail: ["deviceInfo", "userInfo", function(next, results) {
        DEVICE_INFO = results.deviceInfo;
        USER_INFO   = results.userInfo;

        var params = _.extend({}, results.userInfo, {
          from: results.deviceInfo.name,
          productid: parseUrl().productid
        });

        sendPost("productDetail", params, function(err, data) {
          if (err) {
            next(err);
            return;
          }

          next(null, data);
        });
      }] 
    }, function(err, results) {
      if (err) {
        toast(err.message, 1500);
        return;
      }

      var data = results.productDetail;
      var buttonClass = "forbidden-color";

      // 0: 正常兑换; 1: 已结束; 2: 未开始; 3: 已兑完; 4: 今日已兑完。
      if ( String(results.productDetail.stat) === "0" ) {
        buttonClass = "allow-color";

        self.$el.$exchangeButton.on("click", function() {
          self.$el.$shade.show();
          self.$el.$promptBoard.show();
        });

        self.$el.$promptBoard
          .on("click", ".js-confirm", function() {
            self.exchange({
              type: data.type,
              thirdparturl: data.thirdparturl || ""
            });
          })
          .on("click", ".js-cancel", function() {
            self.$el.$promptBoard.hide();
            self.$el.$shade.hide();
          });
      }

      self.$el.$exchangeButton
        .text(data.button)
        .addClass(buttonClass)
        .show();
    });
  },
  exchange: function(options) {

    // type：类型    
    // 1--直接调用创建订单接口      
    // 2--转入输入手机号页面（预留）      
    // 3--转入输入地址页面（预留）   
    // 9--点击跳转第三方链接（ thirdparturl ）
    switch ( String(options.type) ) {
      case "1":
        this.$el.$promptBoard.hide();
        this.mallCreateOrder();
        break;
      case "9":
        window.location.href = options.thirdparturl;
        break;
    }
  },
  mallCreateOrder: function() {
    var self = this;
    var params = _.extend({}, USER_INFO, {
      from: DEVICE_INFO.name,
      productid: parseUrl().productid
    });

    sendPost("createOrder", params, function(err, data) {
      if (err) {
        self.$el.$promptFail
          .one("click", ".js-close", function() {
            self.$el.$promptFail.hide();
            self.$el.$shade.hide();
          })
          .find(".js-message")
            .html(err.message)
          .end()
          .show();
        return;
      }

      self.$el.$promptSuccess
        .one("click", ".js-goto-order-detail", function() {
          window.location.href = "/fe/app/client/mall/html/detail-page/order-detail.html" +
            "?orderid=" + data.orderid;
        })
        .find(".js-message")
          .html(data.message)
        .end()
        .show();
    });
  }
});

new AppView(); 
