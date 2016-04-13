var $          = require("jquery");
var Backbone   = require("backbone");
var _          = require("lodash");
var async      = require("async");
var sendPost   = require("app/client/mall/js/lib/mall-request.js").sendPost;
var toast      = require("com/mobile/widget/hint/hint.js").toast;
var parseUrl   = require("com/mobile/lib/url/url.js").parseUrlSearch;
var appInfo    = require("app/client/mall/js/lib/app-info.js");
var widget     = require("app/client/mall/js/lib/common.js");
var loadScript = require("com/mobile/lib/load-script/load-script.js");
var cookie     = require("com/mobile/lib/cookie/cookie.js");
var shareUtil  = require("com/mobile/widget/wechat/util.js");
var wechatUtil = require("com/mobile/widget/wechat-hack/util.js");
var mallWechat = require("app/client/mall/js/lib/wechat.js");
var logger     = require("com/mobile/lib/log/log.js");
var mallUitl   = require("app/client/mall/js/lib/util.js");
var ShareInput = require("app/client/mall/js/share-page/share-input.js");
var ui         = require("app/client/mall/js/lib/ui.js");

var AppView = Backbone.View.extend({
  el: "#interlayer",
  events: {
    "click .js-common-share": "handleShareButton",
    "click a": "createNewPage"
  },
  initialize: function() {
    this.$initial = ui.initial().show();
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
    } else if ( wechatUtil.isWechatFunc() ) {
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

      self.$el.append(result.tpl);
      self.initActive();

      if ( wechatUtil.isWechatFunc() ) {
        wechatUtil.setTitle(result.title);
        if ( shareUtil.hasShareInfo() ) {
          loadScript(window.location.origin + "/fe/com/mobile/widget/wechat/wechat.bundle.js");
        }
      } else {
        widget.updateViewTitle(result.title);
        if ( shareUtil.hasShareInfo() ) {
          mallWechat.initNativeShare();
        }
      }

      var isApp = mallUitl.isAppFunc();

      if ( !isApp ) {
        require("app/client/mall/js/lib/download-app.js").init( isApp );
      }

      self.$initial.hide();
    });
  },
  initActive: function() {
    var id = parseUrl().productid;

    if ( String(id) === "10000184" || String(id) === "22000003") {
      new ShareInput({ el: "#interlayer" });
    }
  }
});

new AppView();
