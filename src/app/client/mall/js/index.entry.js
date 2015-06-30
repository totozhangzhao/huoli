var $          = require("jquery");
var Backbone   = require("backbone");
var _          = require("lodash");
var async      = require("async");
var NativeAPI  = require("app/client/common/lib/native/native-api.js");
var appInfo    = require("app/client/mall/js/lib/appInfo.js");
var Swipe      = require("com/mobile/lib/swipe/swipe.js");
var toast      = require("com/mobile/widget/toast/toast.js");
var parseUrl   = require("com/mobile/lib/url/url.js").parseUrlSearch;
var Util       = require("com/mobile/lib/util/util.js");
var storage    = require("app/client/mall/js/lib/storage.js");
var widget     = require("app/client/mall/js/lib/widget.js");
var echo       = require("com/mobile/lib/echo/echo.js");
var mallUitl   = require("app/client/mall/js/lib/util.js");
var IScroll    = require("com/mobile/lib/iscroll/iscroll-probe.js");
var sendPost   = require("app/client/mall/js/lib/mall-request.js").sendPost;

var AppView = Backbone.View.extend({
  el: "#main",
  events: {
    "click .js-new-page": "createNewPage"
  },
  initialize: function() {
    var self = this;
    var version = this.getVersion(parseUrl().p);

    // 不支持 3.1 之前的版本
    if (version < 3.1) {
      window.location.href = mallUitl.getUpgradeUrl();
      return;
    }

    this.mainScroller;
    this.$el.$pionts = $("#index-points-bar");

    this.initBanner();
    this.mallMainProductList();

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

      self.mallGetUserInfo({ userData: result });
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
            .text(result.point)
            .addClass("animaion-blink");

        setTimeout(function() {
          self.$el.$pionts
            .find(".js-points")
            .removeClass("animaion-blink");
        }, 2000);
      });
    };

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
      doCheckin();
    });
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
        sendPost("newProductMain", null, function(err, data) {
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
          goodsList: result
        }))
        .show();

      self.loadImage();
      self.pageScroll();
    });
  },
  mallGetUserInfo: function(options) {
    var self = this;
    
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
        storage.get("mallInfo", function(data) {
          data = Util.isObject(data) ? data : {};
          next(null, userData, data);
        });
      },
      function(userData, data, next) {
        if (userData.userInfo.authcode) {
          data.loginOnIndex = true;
          storage.set("mallInfo", data, function() {
            next(null, userData);
          });
        } else {
          data.loginOnIndex = false;
          storage.set("mallInfo", data, function() {});
          return;
        }
      },
      function(userData, next) {
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
      }
    ], function(err, result) {
      if (err) {
        toast(err.message, 1500);
        return;
      }
      var points = result.points;

      $("#index-points-bar")
        .show()
        .find(".js-points")
          .text(points);
      
      self.pageScroll();
      self.mallCheckin();
    });
  },
  pageScroll: function() {
    if (this.mainScroller) {
      this.mainScroller.refresh();
    } else {
      this.initScroll();
    }
  },
  getIScrollConfig: function() {
    var config = {
      useTransition: false,
      probeType: 2,
      click: true
    };

    var ua = window.navigator.userAgent;

    // Click event fires twice on some Android Device
    if ( /Huawei/.test(ua) && /Android 4/.test(ua) ) {
      config.click = false;
      config.tap = true;
    }

    return config;
  },
  initScroll: function() {
    var scroller = this.mainScroller = new IScroll("#index-wrapper", this.getIScrollConfig());
    
    var $pullDownEl = $("#pull-down");
    var pullDownOffset = $pullDownEl.data("pullDownOffset");
    var $text = $pullDownEl.find(".line-two");
    var textObj = $text.data();
    var yStartFromZero = false;
    var pullActionFlag = false;

    scroller.on("scrollStart", function() {
      if (scroller.y === 0) {
        $text.text(textObj.initText);
        yStartFromZero = true;
      }
    });

    scroller.on("scroll", function() {
      if (this.y > pullDownOffset) {
        $text.text(textObj.execText);
        pullActionFlag = true;
        $pullDownEl.addClass("loading");
      } else {
        $text.text(textObj.initText);
        pullActionFlag = false;
        $pullDownEl.removeClass("loading");
      }
    });

    scroller.on("scrollEnd", function() {
      if (yStartFromZero && pullActionFlag) {
        scroller._execEvent("pullToRefresh");
        $text.text(textObj.loadingText);
      } else {
        $text.text(textObj.initText);
        yStartFromZero = false;
      }
      this.refresh();
    });

    scroller.on("pullToRefresh", function() {
      setTimeout(function() {
        window.location.reload();
      }, 1000);
    });
  },
  loadImage: function() {
    echo.init({
      offset: 250,
      throttle: 250,
      unload: false,
      delayIndex: 4,
      callback: function() {}
    });
  },
  initBanner: function() {
    async.waterfall([
      function(next) {
        sendPost("getBanners", null, function(err, data) {
          next(err, data);
        });        
      }
    ], function(err, result) {
      if (err) {
        toast(err.message, 1500);
        return;
      }

      var bannerTpl = require("app/client/mall/tpl/main-banner.tpl");

      $("#top-banner").html(bannerTpl({
        bannerList: result
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
      system: Util.getMobileSystem()
    }));
  },
  createNewPage: function(e) {
    widget.createAView(e);
  }
});

new AppView();
