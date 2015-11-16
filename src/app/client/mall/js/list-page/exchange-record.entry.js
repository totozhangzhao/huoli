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
var imgDelay  = require("app/client/mall/js/lib/widget.js").imageDelay;
var logger    = require("com/mobile/lib/log/log.js");
var mallUitl  = require("app/client/mall/js/lib/util.js");
var storage   = require("app/client/mall/js/lib/storage.js");

var AppView = Backbone.View.extend({
  el: "#order-list",
  events: {
    "click .js-tab": "switchList",
    "click .js-order-item": "gotoOrderDetail"
  },
  initialize: function() {

    // rem
    widget.initRem();

    var self = this;

    this.loadingMore = false;

    hint.showLoading();

    this.$el.$emptyHint = $("#empty-record-hint");
    this.$el.$emptyHint
      .on("click", function() {
        self.refreshPage();
      });

    this.mallOrderList();
    logger.track(mallUitl.getAppName() + "PV", "View PV", document.title);
  },
  switchList: function(e) {
    var $cur = $(e.currentTarget);

    if ( $cur.hasClass("on") ) {
      return;
    }

    this.$el.find(".js-tab").removeClass("on");
    $cur.addClass("on");

    this.listType = this.$el.find(".js-tab.on").data("type");

    this.$el
      .find(".js-container")
        .removeClass("on")
        .eq( $cur.index() )
          .addClass("on");


    this.mallOrderList();
  },
  initLoadingMore: function() {
    var self = this;
    var screenHeight = $(window).height();
    var edgeHeight = screenHeight * 0.35;
    
    $(window).on("scroll", function() {
      if (self.loadingMore) {
        return;
      }

      if ( $(window).scrollTop() + screenHeight > $(document).height() - edgeHeight ) {
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
    var $listBox = this.$el.find(".js-container.on");
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
      lastOrderId: lastOrderId,
      listType: this.listType
    }, renderView);
  },
  mallOrderList: function() {
    var self = this;
    var $listBox = this.$el.find(".js-container.on");

    if ( $listBox.data("_cache") ) {
      return;
    }

    var listType = this.listType || this.$el.find(".js-tab.on").data("type");

    var renderView = function(err, result) {
      if (err) {
        toast(err.message, 1500);
        return;
      }

      self.$el
        .find(".js-ui-hide")
        .addClass("show");

      if (!Array.isArray(result) || result.length === 0) {
        $listBox.hide();
        toast("暂无订单", 1500);
        // self.$el.$emptyHint.show();
      } else {
        var compiled = require("app/client/mall/tpl/list-page/exchange-record.tpl");
        var tmplData = {
          orderList: result
        };
        
        $listBox
          .html( compiled(tmplData) )
          .data("_cache", true);
        imgDelay();
        self.setUpdatePage();
      }
    
      hint.hideLoading();
      self.initLoadingMore();
    };

    this.getOrderList({ listType: listType }, renderView);
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
            last: options.lastOrderId || "",
            type: options.listType
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
  setUpdatePage: function() {
    NativeAPI.registerHandler("resume", function() {
      async.waterfall([
        function(next) {
          storage.get("mallInfo", function(data) {
            data = data || {};
            var orderFlag = false;

            if (data.status) {
              orderFlag = data.status.orderChanged;
            }

            next(null, orderFlag, data);
          });
        },
        function(orderFlag, data, next) {
          if (data.status) {
            data.status.orderChanged = false;
          }

          storage.set("mallInfo", data, function() {
            next(null, orderFlag);
          });
        }
      ], function(err, result) {
          if (result) {
            window.location.reload();
          }
      });
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
