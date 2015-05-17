var $         = require("jquery");
var Backbone  = require("backbone");
var _         = require("underscore");
var async     = require("async");
var NativeAPI = require("app/client/common/lib/native/native-api.js");
var requestAPI = require("app/client/mall/js/lib/request.js");
var toast = require("com/mobile/widget/toast/toast.js");
var parseUrl  = require("com/mobile/lib/url/url.js").parseUrlSearch;

// method, params, callback
var sendPost = requestAPI.createSendPost({
  url: "/bmall/rest/"
});

var AppView = Backbone.View.extend({
  el: "body",
  initialize: function() {
    NativeAPI.invoke("updateTitle", {
      text: "订单详情"
    });

    this.mallOrderDetail();
  },
  mallOrderDetail: function() {
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
      orderDetail: ["deviceInfo", "userInfo", function(next, results) {
        var params = _.extend({}, results.userInfo, {
          from: results.deviceInfo.name,
          orderid: parseUrl().orderid
        });

        sendPost("orderDetail", params, function(err, data) {
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

      var compiled = _.template( $("#tmpl-order-detail").html() );
      var tmplData = {
        orderDetail: results.orderDetail
      };
      
      $("#order-detail-container").html( compiled(tmplData) );
    });
  }
});

new AppView(); 
