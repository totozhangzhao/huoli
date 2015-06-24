var $          = require("jquery");
var Backbone   = require("backbone");
var _          = require("lodash");
var async      = require("async");
var NativeAPI  = require("app/client/common/lib/native/native-api.js");
var requestAPI = require("app/client/mall/js/lib/request.js");
var appInfo    = require("app/client/mall/js/lib/appInfo.js");
var Swipe      = require("com/mobile/lib/swipe/swipe.js");
var toast      = require("com/mobile/widget/toast/toast.js");
var parseUrl   = require("com/mobile/lib/url/url.js").parseUrlSearch;
var Util       = require("com/mobile/lib/util/util.js");
var storage    = require("app/client/mall/js/lib/storage.js");
var widget     = require("app/client/mall/js/lib/widget.js");
var echo       = require("com/mobile/lib/echo/echo.js");
var mallUitl   = require("app/client/mall/js/lib/util.js");
// var IScroll    = require("com/mobile/lib/iscroll/iscroll.js");

// method, params, callback
var sendPost = requestAPI.createSendPost({
  url: "/bmall/rest/"
});

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

    this.initBanner();

    NativeAPI.invoke("updateTitle", {
      text: "积分商城"
    });

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

      self.mallMainProductList(result);
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
  mallGetUserInfo: function(options) {
    async.waterfall([
      function(next) {
        appInfo.getUserData(function(err, userData) {
          if (err) {
            next(err);
            return;
          }

          next(null, userData);
        }, options || {});
      },
      function(userData, next) {
        storage.get("mallInfo", function(data) {
          data = Util.isObject(data) ? data : {};
          next(null, userData, data);
        });
      },
      function(userData, data, next) {
        if (userData.userInfo.authcode) {
          data.isLogin = true;
          storage.set("mallInfo", data, function() {
            next(null, userData);
          });
        } else {
          data.isLogin = false;
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
    });
  },
  mallMainProductList: function(userData) {
    var self = this;

    async.waterfall([
      function(next) {
        var params = _.extend({}, userData.userInfo, {
          p: userData.deviceInfo.p
        });

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

      // stateicon 的具体种类
      //
      // 新用户 "new-user"
      // 老用户 "old-user"
      // 抢兑 "state-grab"
      // 月卡 "month-card"
      // 季卡 "quarter-card"
      //
      // [{
      //   "productid": "1000010",
      //   "title": "伙力",
      //   "detail": "吃货的创意旅行，约吗？",
      //   "stateicon": "state-grab",
      //   "pprice": 0,
      //   "img": ""
      // }, {
      //   "productid": "1000010",
      //   "title": "高铁红包",
      //   "detail": "我带红包去旅行",
      //   "stateicon": "old-user",
      //   "pprice": 1000,
      //   "img": ""
      // }]
      $("#goods-block").html(goodsTpl({
        goodsList: result
      }));

      self.loadImage();
      self.mallGetUserInfo();
      // self.pageScroll();
    });
  },
  // pageScroll: function() {
  //   var scrollElem = new IScroll("#index-wrapper", {
  //     click: true
  //   });
    
  //   var yStartFromZero = false;

  //   var pullDownEl = $(".pull-down")[0];

  //   scrollElem.on("scrollStart", function() {
  //     pullDownEl.querySelector(".pull-down-text").innerHTML = "下拉刷新...";
  //     if (scrollElem.y === 0) {
  //       yStartFromZero = true;
  //     }
  //     setTimeout(function() {
  //       pullDownEl.querySelector(".pull-down-text").innerHTML = "松手即可刷新...";
  //     }, 600);
  //   });

  //   scrollElem.on("scroll", function() {
  //     console.log("scroll");
  //   });

  //   scrollElem.on("scrollEnd", function() {
  //     if (yStartFromZero && scrollElem.directionY === -1) {
  //       scrollElem._execEvent("pullToRefresh");
  //     }
  //     yStartFromZero = false;
  //   });

  //   scrollElem.on("pullToRefresh", function() {
  //     window.location.reload();
  //   });
  // },
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
