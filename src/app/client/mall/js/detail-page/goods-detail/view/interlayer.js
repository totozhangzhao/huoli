// var $          = require("jquery");
var Backbone   = require("backbone");
var _          = require("lodash");
var async      = require("async");
var NativeAPI  = require("app/client/common/lib/native/native-api.js");
var sendPost   = require("app/client/mall/js/lib/mall-request.js").sendPost;
var toast      = require("com/mobile/widget/hint/hint.js").toast;
var parseUrl   = require("com/mobile/lib/url/url.js").parseUrlSearch;
var appInfo    = require("app/client/mall/js/lib/app-info.js");
var widget     = require("app/client/mall/js/lib/widget.js");
var loadScript = require("com/mobile/lib/load-script/load-script.js");
var shareUtil  = require("com/mobile/widget/wechat/util.js");

var AppView = Backbone.View.extend({
  el: "#interlayer",
  events: {
    "click a": "createNewPage"
  },
  initialize: function() {
    this.mallInterlayer();

    if ( shareUtil.hasShareInfo() ) {
      loadScript(window.location.origin + "/fe/com/mobile/widget/wechat/wechat.bundle.js");
    }
  },
  resume: function() {
    if (this.title) {
      this.updateNativeView(this.title);
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

    if ( shareUtil.hasShareInfo() ) {
      this.setShareButton();
    }
  },
  setShareButton: function() {
    var self = this;

    NativeAPI.invoke("updateHeaderRightBtn", {
      action: "show",
      text: "分享"
    }, function(err) {
      if (err) {

        // 此页面有可能被分享出去，不能在外部(如微信)弹出 Internal error
        window.console.log(err.message, 1500);
        return;
      }
    });

    NativeAPI.registerHandler("headerRightBtnClick", function() {
      self.shareFromApp();
    });
  },
  shareFromApp: function() {
    var shareInfo = shareUtil.getShareInfo();

    NativeAPI.invoke("sharePage", {
      title: shareInfo.title,
      desc: shareInfo.desc,
      link: shareInfo.link,
      imgUrl: shareInfo.imgUrl
    }, function(err) {
      if (err) {
        window.console.log(err.message, 1500);
        return;
      }
    });
  },
  updateNativeView: function(title) {
    NativeAPI.invoke("updateTitle", {
      text: title
    });
  }
});

module.exports = AppView;
