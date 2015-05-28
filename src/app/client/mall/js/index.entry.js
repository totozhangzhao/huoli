var $          = require("jquery");
var Backbone   = require("backbone");
var _          = require("lodash");
var async      = require("async");
var NativeAPI  = require("app/client/common/lib/native/native-api.js");
var requestAPI = require("app/client/mall/js/lib/request.js");
var Swipe      = require("com/mobile/lib/swipe/swipe.js");
var toast      = require("com/mobile/widget/toast/toast.js");
var parseUrl   = require("com/mobile/lib/url/url.js").parseUrlSearch;
var getSystem  = require("com/mobile/lib/util/util.js").getMobileSystem;

// method, params, callback
var sendPost = requestAPI.createSendPost({
  url: "/bmall/rest/"
});

var USER_INFO = {
  uid: "",
  userid: "",
  authcode: ""
};

var AppView = Backbone.View.extend({
  el: "body",
  events: {
    "click .js-new-page": "createNewPage"
  },
  initialize: function() {
    var versionInfo = parseUrl().p || "";
    var numStr = versionInfo.slice( versionInfo.indexOf("gtgj,") ).split(",")[1];

    if ( parseFloat(numStr) < 3.1 ) {
      window.location.href = "http://cdn.rsscc.cn/guanggao/upgrade/upgrade.html";
      return;
    }

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

    NativeAPI.invoke("updateTitle", {
      text: "积分商城"
    });

    // this.$el.$shade       = $(".js-shade");
    // this.$el.$loginPrompt = $(".js-login-prompt");

    this.mallMainProductList();
    this.mallGetUserInfo();
  },
  mallGetUserInfo: function() {
    // var self = this;

    async.auto({
      deviceInfo: function(next) {
        NativeAPI.invoke("getDeviceInfo", null, function(err, data) {
          if (err) {
            next(null, {
              name: "gtgj"
            });
            return;
          }

          next(null, data);
        });
      },
      userInfo: function(next) {
        NativeAPI.invoke("getUserInfo", null, function(err, data) {
          if (err) {
            next(err);
            return;
          }

          if (_.isObject(data) && !data.authcode) {
            next({
              "message": "未登录",
              "code": -32001
            });
            return;
          }

          next(null, data);
        });
      },
      userPointsInfo: ["deviceInfo", "userInfo", function(next, results) {
        var params = _.extend({}, results.userInfo, {
          p: results.deviceInfo.p
        });

        sendPost("getUserInfo", params, function(err, data) {
          if (err) {
            next(err);
            return;
          }

          next(null, data);
        });
      }] 
    }, function(err, results) {
      if (err) {
        if ( String(err.code) === "-32001" ) {
          // self.$el.$shade.show();
          // self.$el.$loginPrompt
          //   .on("click", ".js-confirm", function() {
          //     window.location.href = "gtgj://?type=gtlogin&bindflag=1&callback=" +
          //       window.btoa(unescape(encodeURIComponent( window.location.href )));
          //   })
          //   .on("click", ".js-cancel", function() {
          //     self.$el.$loginPrompt.hide();
          //     self.$el.$shade.hide();
          //   })
          //   .show();

          return;
        }

        toast(err.message, 1500);
        return;
      }

      var points = results.userPointsInfo.points;

      $("#index-points-bar")
        .show()
        .find(".js-points")
        .text(points);
    });
  },
  mallMainProductList: function() {
    var self = this;

    async.waterfall([
      function(next) {
        sendPost("mainProductList", USER_INFO, function(err, data) {
          next(err, data);
        });        
      }
    ], function(err, result) {
      self.fixTpl();

      if ( err && (String(err.code) !== "-32001") ) {
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
    });
  },
  fixTpl: function() {
    var crTpl = require("app/client/mall/tpl/copyright.tpl");

    $("#copyright").html(crTpl({
      system: getSystem()
    }));
  },
  createNewPage: function(e) {
    e.preventDefault();
    
    var $cur = $(e.currentTarget);
    var url = $cur.prop("href");

    if ( $cur.data() ) {
      url = url.indexOf("?") >= 0 ? url : url + "?";
      url = url + $.param( $cur.data() );
    }

    NativeAPI.invoke("createWebView", {
      url: url,
      controls: [
        {
          type: "title",
          text: $cur.data("title")
        }
      ]
    });
  }
});

new AppView(); 
