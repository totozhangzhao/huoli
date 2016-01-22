var $         = require("jquery");
var Backbone  = require("backbone");
var _         = require("lodash");
var async     = require("async");
var NativeAPI = require("app/client/common/lib/native/native-api.js");
var appInfo   = require("app/client/mall/js/lib/app-info.js");
var Swipe     = require("com/mobile/lib/swipe/swipe.js");
var toast     = require("com/mobile/widget/hint/hint.js").toast;
var parseUrl  = require("com/mobile/lib/url/url.js").parseUrlSearch;
var Util      = require("com/mobile/lib/util/util.js");
var storage   = require("app/client/mall/js/lib/storage.js");
var widget    = require("app/client/mall/js/lib/widget.js");
var imgDelay  = require("app/client/mall/js/lib/widget.js").imageDelay;
var mallUitl  = require("app/client/mall/js/lib/util.js");
var sendPost  = require("app/client/mall/js/lib/mall-request.js").sendPost;
var logger    = require("com/mobile/lib/log/log.js");
var tplUtil   = require("app/client/mall/js/lib/mall-tpl.js");

require("com/mobile/widget/button/back-to-top.js");

var AppView = Backbone.View.extend({
  el: "#main",
  events: {
    "click .js-new-page": "createNewPage",
    "click .js-get-url" : "handleGetUrl"
  },
  initialize: function() {

    // rem
    widget.initRem();

    var self = this;
    var version = this.getVersion(parseUrl().p);

    // 不支持 3.1 之前的版本
    if (version < 3.1) {
      window.location.href = mallUitl.getUpgradeUrl();
      return;
    }

    var title = mallUitl.isHangbanFunc() ? "航班商城" : "高铁商城";
    widget.updateViewTitle(title);
    this.$el.$pionts = $("#index-points-bar");

    async.waterfall([
      function(next) {
        appInfo.getUserData(function(err, userData) {
          if (err) {
            next(err);
            return;
          }

          next(null, userData);
        }, { reset: true });
      },
      function(userData, next) {
        version = self.getVersion(userData.deviceInfo.p);

        storage.set("mallInfo", {
          version: version,
          indexPageUrl: window.location.href
        }, function() {
          next(null, userData);
        });
      }
    ], function(err, result) {
      if (err) {
        toast(err.message, 1500);
        return;
      }
      
      self.initBanner();
      self.mallGetUserInfo({ userData: result });
      self.mallMainProductList();

      setTimeout(function() {
        NativeAPI.registerHandler("resume", function() {
          self.mallGetUserInfo({
            rightButtonReady: true
          });
        });
      }, 0);

      logger.track(mallUitl.getAppName() + "PV", "View PV", title);
    });
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
  getVersion: function(versionInfo) {
    
    //
    // Pro:
    // "appstorepro,ios,8.3,gtgjpro,3.3,iPhone7.2,0"
    //
    // Normal:
    // "appstorepro,ios,8.3,gtgj,3.3,iPhone7.2,0"
    //
    versionInfo = versionInfo || "";
    var numStr = versionInfo.split(",")[4];
    return parseFloat(numStr);
  },
  mallMainProductList: function() {
    var self = this;

    async.waterfall([
      function(next) {
        var params = {
          p: parseUrl().p
        };
        sendPost("mainProductList", params, function(err, data) {
          next(err, data);
        });        
      }
    ], function(err, result) {
      self.fixTpl();

      if (err) {
        toast(err.message, 1500);
        return;
      }

      var goodsTpl = require("app/client/mall/tpl/main-goods-list.tpl");

      $("#goods-block")
        .html(goodsTpl({
          topList  : result.focus,
          goodsList: result.groups,
          appName  : mallUitl.getAppName(),
          tplUtil  : tplUtil
        }))
        .show();

      imgDelay();
    });
  },
  mallGetUserInfo: function(opts) {
    var self = this;
    var options = opts || {};

    async.waterfall([
      function(next) {
        if (options.userData) {
          next(null, options.userData);
        } else {
          appInfo.getUserData(function(err, userData) {
            if (err) {
              next(err);
              return;
            }

            next(null, userData);
          }, options || {});
        }
      },
      function(userData, next) {
        if (userData.userInfo && userData.userInfo.userid) {
          var params = _.extend({}, userData.userInfo, {
            p: userData.deviceInfo.p
          });

          sendPost("getUserInfo", params, function(err, data) {
            if (err) {
              next(err);
              return;
            }

            next(null, data);
          });
        } else {
          next(null, {});
        }
      }
    ], function(err, result) {
      if (err) {
        toast(err.message, 1500);
        return;
      }

      if (result &&
          typeof result.points !== "undefined" &&
          result.points !== null
      ) {
        $("#index-points-bar")
          .show()
          .find(".js-points")
            .text(result.points);        
      }

      if (!options.rightButtonReady) {
        self.mallCheckin();
      }
    });
  },
  mallCheckin: function() {
    var self = this;
    var doCheckin = function() {
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
          if (userData.userInfo && userData.userInfo.userid) {
            var params = _.extend({}, userData.userInfo, {
              p: userData.deviceInfo.p
            });

            sendPost("checkin", params, function(err, data) {
              if (err) {
                next(err);
                return;
              }

              next(null, data);
            });
          } else {
            self.loginApp();
          }
        }
      ], function(err, result) {
        if (err) {
          toast(err.message, 1500);
          return;
        }

        toast(result.msg, 1500);

        self.$el.$pionts
          .show()
          .find(".js-points")
            .text(result.points)
            .addClass("animaion-blink");

        setTimeout(function() {
          self.$el.$pionts
            .find(".js-points")
            .removeClass("animaion-blink");
        }, 2000);
      });
    };

    if ( !mallUitl.isHangbanFunc() ) {
      NativeAPI.invoke("updateHeaderRightBtn", {
        action: "show",
        text: "签到"
      }, function(err) {
        if (err) {
          toast(err.message, 1500);
          return;
        }
      });

      NativeAPI.registerHandler("headerRightBtnClick", function() {
        if ( mallUitl.isHangbanFunc() ) {
          doCheckin();
        } else {
          widget.createNewView({
            url: "https://jt.rsscc.com/gtgjwap/act/20150925/index.html"
          });        
        }
        logger.track(mallUitl.getAppName() + "-签到", "click");
      });
    }
  },
  loginApp: function() {
    var self = this;

    async.waterfall([
      function(next) {

        // window.location.href = "gtgj://?type=gtlogin&bindflag=1&callback=" +
        //   window.btoa(unescape(encodeURIComponent( window.location.href )));

        NativeAPI.invoke("login", null, function(err, data) {
          next(err, data);
        });
      }
    ], function(err) {
        if (err) {
          toast(err.message, 1500);
          return;
        }

        setTimeout(function() {
          self.mallGetUserInfo({
            rightButtonReady: true
          });
        }, 500);
    });
  },
  initBanner: function() {
    async.waterfall([
      function(next) {
        var params = {
          p: parseUrl().p
        };
        sendPost("getBanners", params, function(err, data) {
          next(err, data);
        });        
      }
    ], function(err, result) {
      if (err) {
        toast(err.message, 1500);
        return;
      }

      if (result.length === 0) {
        return;
      }

      var bannerTpl = require("app/client/mall/tpl/main-banner.tpl");

      $("#top-banner").html(bannerTpl({
        bannerList: result,
        appName: mallUitl.getAppName(),
        tplUtil  : tplUtil
      }));

      var $SwipeBox = $("#top-banner .js-banner-box");
      var $index    = $("#top-banner .js-banner-index");

      new Swipe($SwipeBox.get(0), {
        startSlide: 0,
        speed: 400,
        auto: 3000,
        continuous: true,
        disableScroll: false,
        stopPropagation: false,
        callback: function(index) {
          $index
            .removeClass("active")
              .eq(index)
              .addClass("active");
        },
        transitionEnd: function() {}
      });
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
