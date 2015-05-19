var $          = require("jquery");
var Backbone   = require("backbone");
var _          = require("lodash");
var async      = require("async");
var NativeAPI  = require("app/client/common/lib/native/native-api.js");
var requestAPI = require("app/client/mall/js/lib/request.js");
var Swipe      = require("com/mobile/lib/swipe/swipe.js");
var toast      = require("com/mobile/widget/toast/toast.js");
var getSystem  = require("com/mobile/lib/util/util.js").getMobileSystem;

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

    this.$el.$shade       = $(".js-shade");
    this.$el.$loginPrompt = $(".js-login-prompt");

    this.mallGetUserInfo();
  },
  mallGetUserInfo: function() {
    var self = this;

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
            next("notLogin");
            return;
          }

          next(null, data);
        });
      },
      userPointsInfo: ["deviceInfo", "userInfo", function(next, results) {
        var params = _.extend({}, results.userInfo, {
          from: results.deviceInfo.name
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
        self.fixTpl();

        if (err === "notLogin") {
          self.$el.$shade.show();
          self.$el.$loginPrompt
            .on("click", ".js-confirm", function() {
              window.location.href = "gtgj://?type=gtlogin&bindflag=1&callback=" +
                window.btoa(unescape(encodeURIComponent( window.location.href )));
            })
            .on("click", ".js-cancel", function() {
              self.$el.$loginPrompt.hide();
              self.$el.$shade.hide();
            })
            .show();

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

      self.fixTpl();
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
