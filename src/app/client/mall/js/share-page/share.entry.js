var $          = require("jquery");
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
var cookie     = require("com/mobile/lib/cookie/cookie.js");
var wechatUtil = require("com/mobile/widget/wechat-hack/util.js");

var AppView = Backbone.View.extend({
  el: "#interlayer",
  events: {
    "click .js-common-share": "handleShareButton",
    "click a": "createNewPage"
  },
  initialize: function() {
    this.mallInterlayer();
  },
  handleShareButton: function(e) {
    var urlObj = $(e.currentTarget).data();
    var appName = cookie.get("appName");

    if ( /hbgj/i.test(appName) ) {
      widget.createNewView({
        url: urlObj.hbgjUrl || urlObj.appUrl
      });
    } else if ( /gtgj/i.test(appName) ) {
      widget.createNewView({
        url: urlObj.gtgjUrl || urlObj.appUrl
      });
    } else if ( wechatUtil.isWechat() ) {
      window.location.href = urlObj.wechatUrl || urlObj.weixinUrl || urlObj.webUrl;
    } else {
      widget.createNewView({
        url: urlObj.webUrl || urlObj.url
      });
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

      if ( wechatUtil.isWechat() ) {
        wechatUtil.setTitle(result.title);
      } else {
        self.updateNativeView(result.title);
      }

      self.$el.html(result.tpl || "");

      if ( shareUtil.hasShareInfo() ) {
        self.setShareButton();
        loadScript(window.location.origin + "/fe/com/mobile/widget/wechat/wechat.bundle.js");
      }
    });
  },
  setShareButton: function() {
    var self = this;

    NativeAPI.invoke("updateHeaderRightBtn", {
      action: "show",
      text: "分享"
    }, function(err) {
      if (err) {

        // 此页面有可能被分享出去，不能在外部(如微信)弹出 Internal error
        window.console.log(err.message);
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
        window.console.log(err.message);
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

new AppView();
