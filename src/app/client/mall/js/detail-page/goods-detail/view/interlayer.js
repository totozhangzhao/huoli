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
var loadScript = require("com/mobile/lib/load-script/load-script.js");

// method, params, callback
var sendPost = requestAPI.createSendPost({
  url: "/bmall/rest/"
});

var AppView = Backbone.View.extend({
  el: "#interlayer",
  events: {
    "click a": "createNewPage"
  },
  initialize: function() {
    this.mallInterlayer();

    if ( $("#__wechat_share").length !== 0 ) {
      loadScript(window.location.origin + "/fe/com/mobile/widget/wechat/wechat.bundle.js");
    }
  },
  createNewPage: function(e) {
    widget.createAView(e);
  },
  mallInterlayer: function() {
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
          p: userData.deviceInfo.p,
          productid: parseUrl().productid
        });

        sendPost("tplProduct", params, function(err, data) {
          next(err, data);
        });
      }
    ], function(err, result) {
      if (err) {
        toast(err.message, 1500);
        return;
      }

      self.renderMainPanel(result);
    });
  },
  renderMainPanel: function(tplProductInfo) {
    this.title = tplProductInfo.title;
    this.updateNativeView(tplProductInfo.title);
    this.$el.html(tplProductInfo.tpl || "");
  },
  updateNativeView: function(title) {
    NativeAPI.invoke("updateTitle", {
      text: title
    });
  },
  init: function() {
    if (this.title) {
      this.updateNativeView(this.title);
    }
  }
});

module.exports = AppView;
