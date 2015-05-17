var $         = require("jquery");
var Backbone  = require("backbone");
var _         = require("underscore");
var async     = require("async");
var NativeAPI = require("app/client/common/lib/native/native-api.js");
var requestAPI = require("app/client/mall/js/lib/request.js");
var toast = require("com/mobile/widget/toast/toast.js");

// method, params, callback
var sendPost = requestAPI.createSendPost({
  url: "/bmall/rest/"
});

var AppView = Backbone.View.extend({
  el: "body",
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
      orderList: ["deviceInfo", "userInfo", function(next, results) {
        var params = _.extend(results.userInfo, {
          from: results.deviceInfo.name
        });

        sendPost("orderList", params, function(err, data) {
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

      var compiled = _.template( $("#tmpl-record").html() );
      var tmplData = {
        orderList: results.orderList
      };
      
      $("#order-list").html( compiled(tmplData) );
    });
  },
  gotoOrderDetail: function(e) {
    var $cur = $(e.currentTarget);

    NativeAPI.invoke("createWebView", {
      url: "/fe/app/client/mall/html/detail-page/order-detail.html" +
        "?orderid=" + $cur.data("id"),
      controls: [
        {
          type: "title",
          text: "订单详情"
        }
      ]
    });
  }
});

new AppView(); 
