var $          = require("jquery");
var _          = require("lodash");
var Backbone   = require("backbone");
var async      = require("async");
var NativeAPI  = require("app/client/common/lib/native/native-api.js");
var requestAPI = require("app/client/mall/js/lib/request.js");
var toast      = require("com/mobile/widget/toast/toast.js");
var parseUrl   = require("com/mobile/lib/url/url.js").parseUrlSearch;
var getSystem  = require("com/mobile/lib/util/util.js").getMobileSystem;

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
      orderDetail: ["deviceInfo", "userInfo", function(next, results) {
        var params = _.extend({}, results.userInfo, {
          p: results.deviceInfo.p,
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

      var compiled = require("app/client/mall/tpl/detail-page/order-detail.tpl");
      // var compiled = _.template( $("#tmpl-order-detail").html() );
      var tmplData = {
        orderDetail: results.orderDetail,
      };
      
      $("#order-detail-container").html( compiled(tmplData) );
      self.fixTpl();
    });
  },
  fixTpl: function() {
    var crTpl = require("app/client/mall/tpl/copyright.tpl");

    $("#copyright").html(crTpl({
      system: getSystem()
    }));
  }
});

new AppView(); 
