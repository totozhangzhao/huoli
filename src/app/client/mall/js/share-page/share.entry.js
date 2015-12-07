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
var cookie     = require("com/mobile/lib/cookie/cookie.js");
var shareUtil  = require("com/mobile/widget/wechat/util.js");
var wechatUtil = require("com/mobile/widget/wechat-hack/util.js");
var mallWechat = require("app/client/mall/js/lib/wechat.js");
var logger     = require("com/mobile/lib/log/log.js");
var mallUitl   = require("app/client/mall/js/lib/util.js");
var imgDelay   = require("app/client/mall/js/lib/widget.js").imageDelay;

var AppView = Backbone.View.extend({
  el: "#interlayer",
  events: {
    "click .js-common-share": "handleShareButton",
    "click a": "createNewPage"
  },
  initialize: function() {
    this.mallInterlayer();
    logger.track(mallUitl.getAppName() + "PV", "View PV", document.title);
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

      // var $tmpl = $(result.tpl.replace(/button/g, "div"));
      var $tmpl = $(result.tpl);

      // img lazy load
      // $tmpl.find("img").each(function(index, item) {
      //   var $img = $(item);
      //   $img.addClass("op0");
      //   $img.attr( "data-echo", $img.attr("src") );
      //   $img.attr( "src", "/fe/com/mobile/image/grey.gif" );
      // });

      self.$el.append($tmpl);
      imgDelay();

      if ( wechatUtil.isWechat() ) {
        wechatUtil.setTitle(result.title);
        if ( shareUtil.hasShareInfo() ) {
          loadScript(window.location.origin + "/fe/com/mobile/widget/wechat/wechat.bundle.js");
        }
      } else {
        self.updateNativeView(result.title);
        if ( shareUtil.hasShareInfo() ) {
          mallWechat.initNativeShare();
        }
      }
    });
  },
  updateNativeView: function(title) {
    window.document.title = title;
    NativeAPI.invoke("updateTitle", {
      text: title
    });
  }
});

new AppView();
