var $          = require("jquery");
var Backbone   = require("backbone");
var _          = require("lodash");
var async      = require("async");
var NativeAPI  = require("app/client/common/lib/native/native-api.js");
var requestAPI = require("app/client/mall/js/lib/request.js");
var toast      = require("com/mobile/widget/toast/toast.js");
var appInfo    = require("app/client/mall/js/lib/appInfo.js");
var widget     = require("app/client/mall/js/lib/widget.js");
var echo       = require("com/mobile/lib/echo/echo.js");

// method, params, callback
var sendPost = requestAPI.createSendPost({
  url: "/bmall/rest/"
});

var AppView = Backbone.View.extend({
  el: "#order-list",
  events: {
    "click .js-order-item": "gotoOrderDetail"
  },
  initialize: function() {
    NativeAPI.invoke("updateTitle", {
      text: "积分兑换记录"
    });

    this.mallOrderList();
  },
  mallOrderList: function() {
    var self = this;

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
        var params = _.extend({}, userData.userInfo, {
          p: userData.deviceInfo.p
        });

        sendPost("orderList", params, function(err, data) {
          if (err) {
            next(err);
            return;
          }

          next(null, data);
        });
      }
    ], function(err, result) {
      if (err) {
        toast(err.message, 1500);
        return;
      }

      var $orderList = $("#order-list");

      if (!Array.isArray(result) || result.length === 0) {
        $orderList.hide();
        $("#empty-record-hint").show();
        return;
      }

      var compiled = require("app/client/mall/tpl/list-page/exchange-record.tpl");
      var tmplData = {
        orderList: result
      };
      
      $orderList.html( compiled(tmplData) );
      self.loadImage();
    });
  },
  loadImage: function() {
    echo.init({
      offset: 250,
      throttle: 250,
      unload: false,
      delayIndex: 4,
      callback: function() {}
    });
  },
  gotoOrderDetail: function(e) {
    var $cur = $(e.currentTarget);

    widget.createNewView({
      url: "/fe/app/client/mall/html/detail-page/order-detail.html" +
        "?orderid=" + $cur.data("id"),
      title: "订单详情"
    });
  }
});

new AppView();
