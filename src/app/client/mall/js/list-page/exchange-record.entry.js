var $         = require("jquery");
var Backbone  = require("backbone");
var _         = require("lodash");
var async     = require("async");
var NativeAPI = require("app/client/common/lib/native/native-api.js");
var sendPost  = require("app/client/mall/js/lib/mall-request.js").sendPost;
var toast     = require("com/mobile/widget/hint/hint.js").toast;
var hint      = require("com/mobile/widget/hint/hint.js");
var appInfo   = require("app/client/mall/js/lib/app-info.js");
var widget    = require("app/client/mall/js/lib/widget.js");
var echo      = require("com/mobile/lib/echo/echo.js");

var AppView = Backbone.View.extend({
  el: "#order-list",
  events: {
    "click .js-order-item": "gotoOrderDetail"
  },
  initialize: function() {
    var self = this;

    this.loadingMore = false;
    this.$el.$listBox = this.$el.find(".js-container");

    hint.showLoading();

    this.$el.$emptyHint = $("#empty-record-hint");
    this.$el.$emptyHint
      .on("click", function() {
        self.refreshPage();
      });

    this.mallOrderList();
  },
  initLoadingMore: function() {
    var self = this;

    $(window).on("scroll", function() {
      if (self.loadingMore) {
        return;
      }

      if ( $(window).scrollTop() + $(window).height() > $(document).height() - 100 ) {
        self.loadMore();
      }
    });
  },
  refreshPage: function() {
    window.location.reload();
  },
  loginApp: function() {
    async.waterfall([
      function(next) {

        // window.location.href = "gtgj://?type=gtlogin&bindflag=1&callback=" +
        //   window.btoa(unescape(encodeURIComponent( window.location.href )));

        NativeAPI.invoke("login", null, function(err, data) {
          next(err, data);
        });
      }
    ], function(err, result) {
      if (err) {
        toast(err.message, 1500);
        return;
      }

      if ( String(result.succ) === "1" || result.value === result.SUCC ) {
        window.location.reload();
      } else {
        // hint.hideLoading();
        window.console.log(JSON.stringify(result));
        NativeAPI.invoke("close");
      }
    });
  },
  loadMore: function() {
    var $listBox = this.$el.$listBox;
    var lastOrderId = $listBox
        .find(".js-order-item")
          .last()
          .data("id");

    var renderView = function(err, result) {
      if (err) {
        toast(err.message, 1500);
        return;
      }

      if (Array.isArray(result) && result.length > 0) {
        var compiled = require("app/client/mall/tpl/list-page/exchange-record.tpl");
        var tmplData = {
          orderList: result
        };
        
        $listBox.append( compiled(tmplData) );
      }
    };

    this.getOrderList({
      lastOrderId: lastOrderId
    }, renderView);
  },
  mallOrderList: function() {
    var self = this;

    var renderView = function(err, result) {
      if (err) {
        toast(err.message, 1500);
        return;
      }

      if (!Array.isArray(result) || result.length === 0) {
        self.$el.$listBox.hide();
        self.$el.$emptyHint.show();
      } else {
        var compiled = require("app/client/mall/tpl/list-page/exchange-record.tpl");
        var tmplData = {
          orderList: result
        };
        
        self.$el.$listBox.html( compiled(tmplData) );
        self.loadImage();
        self.setUpdatePage();
      }
    
      hint.hideLoading();
      self.initLoadingMore();
    };

    this.getOrderList(null, renderView);
  },
  getOrderList: function(options, callback) {
    var self = this;
    var options = options || {};

    this.loadingMore = true;

    // 全部订单页面也作为一个入口，所以 { reset: true }
    async.waterfall([
      function(next) {
        appInfo.getUserData(function(err, userData) {
          if (err) {
            toast(err.message, 1500);
            self.loadingMore = false;
            return;
          }

          next(null, userData);
        }, { reset: true });
      },
      function(userData, next) {
        if (userData.userInfo && userData.userInfo.userid) {
          var params = _.extend({}, userData.userInfo, {
            p: userData.deviceInfo.p,
            last: options.lastOrderId || ""
          });

          sendPost("orderList", params, function(err, data) {
            if (err) {
              next(err);
              return;
            }

            next(null, data);
          });
        } else {
          hint.hideLoading();
          self.loginApp();
        }
      }
    ], function(err, result) {
      self.loadingMore = false;
      callback(err, result);
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
  setUpdatePage: function() {
    NativeAPI.registerHandler("resume", function() {
      window.location.reload();
    });
  },
  gotoOrderDetail: function(e) {
    var $cur = $(e.currentTarget);

    widget.createNewView({
      url: "/fe/app/client/mall/html/detail-page/order-detail.html" +
        "?orderid=" + $cur.data("id") +
        "&from=order-list-page",
      title: "订单详情"
    });
  }
});

new AppView();
