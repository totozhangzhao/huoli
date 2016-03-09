var $        = require("jquery");
var Backbone = require("backbone");
var _        = require("lodash");
var async    = require("async");
var appInfo  = require("app/client/mall/js/lib/app-info.js");
var toast    = require("com/mobile/widget/hint/hint.js").toast;
var parseUrl = require("com/mobile/lib/url/url.js").parseUrlSearch;
var Util     = require("com/mobile/lib/util/util.js");
var widget   = require("app/client/mall/js/lib/common.js");
var imgDelay = require("app/client/mall/js/lib/common.js").imageDelay;
var mallUitl = require("app/client/mall/js/lib/util.js");
var sendPost = require("app/client/mall/js/lib/mall-request.js").sendPost;
var logger   = require("com/mobile/lib/log/log.js");
var tplUtil  = require("app/client/mall/js/lib/mall-tpl.js");
var menuLog  = require("app/client/mall/js/lib/common.js").initTracker("menu");

var AppView = Backbone.View.extend({
  el: "#main",
  events: {
    "click .js-new-page": "createNewPage",
    "click .js-get-url" : "handleGetUrl"
  },
  initialize: function() {
    this.mallMainProductList();
    logger.track(mallUitl.getAppName() + "PV", "View PV", document.title);
  },
  handleGetUrl: function(e) {
    async.waterfall([
      function(next) {
        appInfo.getUserData(function(err, userData) {
          if (err) {
            next(err);
            return;
          }
          next(null, userData);
        });
      },
      function(userData, next) {
        var params = _.extend({}, userData.userInfo, userData.deviceInfo, {
          productid: $(e.currentTarget).data("productid")
        });

        sendPost("getUrl", params, function(err, data) {
          next(err, data);
        });
      }
    ], function(err, result) {
      if (err) {
        toast(err.message, 1500);
        return;
      }

      widget.createNewView({
        url: result.url
      });
    });
  },
  createNewPage: function(e) {
    widget.createAView(e);
  },
  mallMainProductList: function() {
    var self = this;

    async.waterfall([
      function(next) {
        var params = {
          classify: parseUrl().classify
        };

        sendPost("getClassify", params, function(err, data) {
          next(err, data);
        });        
      }
    ], function(err, result) {
      self.fixTpl();

      if (err) {
        toast(err.message, 1500);
        return;
      }

      widget.updateViewTitle(result.title);
      
      var groupGoodsTpl = require("app/client/mall/tpl/menu/category.tpl");

      $("#goods-block")
        .html(groupGoodsTpl({
          group: result,
          appName: mallUitl.getAppName(),
          tplUtil  : tplUtil
        }))
        .show();

      imgDelay();
    });

    menuLog({
      title: parseUrl().classify,
      from: parseUrl().from || "--"
    });
  },
  fixTpl: function() {
    var crTpl = require("app/client/mall/tpl/copyright.tpl");

    $("#copyright").html(crTpl({
      system: Util.getMobileSystem(),
      isHangbanFunc: mallUitl.isHangbanFunc()
    }));
  }
});

new AppView();
