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

      var tmpl = $("#tmpl-record").html();
      var compiled = _.template(tmpl);

      var tmplData = {
        orderList: results.orderList
      };

      console.log(tmplData);
      
      $("#order-list").html( compiled(tmplData) );
    });
  },
});

new AppView(); 
