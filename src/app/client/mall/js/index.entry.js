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
var getSystem  = require("com/mobile/lib/util/util.js").getMobileSystem;
var updatePage = require("app/client/mall/js/lib/page-action.js").update;
var storage    = require("app/client/mall/js/lib/storage.js");
var widget     = require("app/client/mall/js/lib/widget.js");
var echo       = require("com/mobile/lib/echo/echo.js");

// method, params, callback
var sendPost = requestAPI.createSendPost({
  url: "/bmall/rest/"
});

var AppView = Backbone.View.extend({
  el: "body",
  events: {
    "click .js-new-page": "createNewPage"
  },
  initialize: function() {
    var versionInfo = parseUrl().p || "";
    var numStr = versionInfo.slice( versionInfo.indexOf("gtgj,") ).split(",")[1];
    var version = parseFloat(numStr);

    // 不支持 3.1 之前的版本
    if ( version < 3.1 ) {
      window.location.href = "http://cdn.rsscc.cn/guanggao/upgrade/upgrade.html";
      return;
    }

    storage.set("mallInfo", {
      version: version
    }, function() {});

    NativeAPI.invoke("updateTitle", {
      text: "积分商城"
    });

    this.mallMainProductList();
    this.mallGetUserInfo();

    var self = this;

    $(window).on("hashchange", function() {
      self.mallGetUserInfo({ reset: true });
    });
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

      updatePage({
        isUpdate: false
      });
    });
  },
  mallMainProductList: function() {
    var self = this;

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

      var goodsTpl = require("app/client/mall/tpl/mainGoodsList.tpl");

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
      self.initBanner();
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
      system: getSystem()
    }));
  },
  createNewPage: function(e) {
    widget.createAView(e);
  }
});

new AppView(); 
