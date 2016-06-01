var $         = require("jquery");
var Backbone  = require("backbone");
var _         = require("lodash");
var async     = require("async");
var NativeAPI = require("app/client/common/lib/native/native-api.js");
var sendPost  = require("app/client/mall/js/lib/mall-request.js").sendPost;
var toast     = require("com/mobile/widget/hint/hint.js").toast;
var appInfo   = require("app/client/mall/js/lib/app-info.js");
var widget    = require("app/client/mall/js/lib/common.js");
var imgDelay  = require("app/client/mall/js/lib/common.js").imageDelay;
var logger    = require("com/mobile/lib/log/log.js");
var mallUitl  = require("app/client/mall/js/lib/util.js");
var storage   = require("app/client/mall/js/lib/storage.js");
var UrlUtil   = require("com/mobile/lib/url/url.js");
var ui        = require("app/client/mall/js/lib/ui.js");
var orderListLog = require("app/client/mall/js/lib/common.js").initTracker("orderList");
var loginUtil    = require("app/client/mall/js/lib/login-util.js");

var AppView = Backbone.View.extend({
  el: "#order-list",
  events: {
    "click .js-tab": "switchList",
    "click .js-order-item": "gotoOrderDetail"
  },
  initialize: function() {
    this.loadingMore = false;
    this.$initial = ui.initial().show();

    // var self = this;
    // this.$el.$emptyHint = $("#empty-record-hint");
    // this.$el.$emptyHint
    //   .on("click", function() {
    //     self.refreshPage();
    //   });

    this.$blank = ui.blank("暂无订单");
    this.mallOrderList();
    this.mallSearchList();
    logger.track(mallUitl.getAppName() + "PV", "View PV", document.title);
    orderListLog({
      title: document.title,
      from: UrlUtil.parseUrlSearch().from || "--"
    });
  },
  setAppRightButton: function(text) {
    NativeAPI.invoke("updateHeaderRightBtn", {
      action: "show",
      text: text
    }, function(err) {
      if (err) {
        window.console.log(err.message);
        return;
      }
    });
  },
  mallSearchList: function() {
    var self = this;

    this.setAppRightButton("搜索");

    var SearchPanel = function() {
      this.$panel = $("#search-list");
      var $list = this.$panel.find(".js-container");
      var timerId;

      var renderSearchResults = function(err, result) {
        if (err) {
          toast(err.message, 1500);
          return;
        }

        if (!Array.isArray(result) || result.length === 0) {
          $list.empty();
          timerId = setTimeout(function() {
            clearTimeout(timerId);
            $list.html( self.$blank );
          }, 3000);
        } else {
          clearTimeout(timerId);
          var compiled = require("app/client/mall/tpl/list-page/exchange-record.tpl");
          var tmplData = {
            orderList: result
          };

          $list.html( compiled(tmplData) );
          imgDelay();
        }
      };

      var $input = this.$panel.find("[data-name='search']");
      var doSearch = function() {
        var keywords = $input.val();

        if (keywords === "") {
          renderSearchResults(null, []);
          clearTimeout(timerId);
          return;
        }

        var options = {
          listType: 4, // 搜索类型
          keywords: keywords
        };

        self.getOrderList(options, renderSearchResults);
      };

      this.$panel
        .on("click", ".js-order-item", self.gotoOrderDetail)
        .on("click", ".js-search-button", doSearch);

      $input
        .on("keypress", function(e) {
          if (e.which === 13) {
            doSearch();
          }
        });
        // .on("click", ".js-search-button", _.debounce(doSearch, 150));
    };

    _.extend(SearchPanel.prototype, {
      show: function() {
        self.$el.hide();
        this.$panel.show();
        self.setAppRightButton("取消");
      },
      hide: function() {
        this.$panel.hide();
        self.$el.show();
        self.setAppRightButton("搜索");
      },
      toggle: function() {
        if ( this.$panel.is(":visible") ) {
          this.hide();
        } else {
          this.show();
        }
      }
    });

    var panel = new SearchPanel();

    NativeAPI.registerHandler("headerRightBtnClick", function() {
      panel.toggle();
    });
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
        $listBox.html( self.$blank );
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

      self.$initial.hide();
      self.initLoadingMore();
    };

    this.getOrderList({ listType: listType }, renderView);
  },
  getOrderList: function(opts, callback) {
    var self = this;
    var options = opts || {};

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

          // style:
          //
          // String 类型
          //
          // 1 商城
          // 2 一元夺宝
          // 3 保险
          // 4 优惠券
          var style = UrlUtil.parseUrlSearch().style || "1";

          var params = _.extend({}, userData.userInfo, {
            p    : userData.deviceInfo.p,
            last : options.lastOrderId || "",
            type : options.listType,
            style: style,
            key  : options.keywords
          });

          sendPost("orderList", params, function(err, data) {
            if (err) {
              next(err);
              return;
            }

            next(null, data);
          });
        } else {
          self.$initial.hide();
          loginUtil.login();
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
