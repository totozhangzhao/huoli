var $          = require("jquery");
var Backbone   = require("backbone");
var _          = require("lodash");
var async      = require("async");
var NativeAPI  = require("app/client/common/lib/native/native-api.js");
var requestAPI = require("app/client/mall/js/lib/request.js");
var appInfo    = require("app/client/mall/js/lib/appInfo.js");
var toast      = require("com/mobile/widget/toast/toast.js");
var parseUrl   = require("com/mobile/lib/url/url.js").parseUrlSearch;
var getSystem  = require("com/mobile/lib/util/util.js").getMobileSystem;

// method, params, callback
var sendPost = requestAPI.createSendPost({
  url: "/bmall/rest/"
});

var AppView = Backbone.View.extend({
  el: "#goods-detail",
  events: {
    "click #goods-desc a": "createNewPage"
  },
  initialize: function() {
    this.$el.$shade          = $("#goods-detail .js-shade");
    this.$el.$loginPrompt    = $("#goods-detail .js-login-prompt");
    this.$el.$exchangeButton = $("#goods-detail .js-exchange-button");
    this.$el.$promptBoard    = $("#goods-detail .js-exchange-prompt");
    this.$el.$promptSuccess  = $("#goods-detail .js-success-prompt");
    this.$el.$promptFail     = $("#goods-detail .js-fail-prompt");
    
    this.title = "";
    this.mallOrderDetail();
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
          text: $cur.data("title") || ""
        }
      ]
    });
  },
  mallOrderDetail: function() {
    var self = this;

    async.waterfall([
      function(next) {
        appInfo.getUserData(function(err, userData) {
          if (err) {
            toast(err.message, 1500);
            return;
          }

          next(null, userData);
        });
      },
      function(userData, next) {
        var params = _.extend({}, userData.userInfo, {
          p: userData.deviceInfo.p,
          productid: parseUrl().productid
        });

        sendPost("productDetail", params, function(err, data) {
          next(err, data);
        });
      }
    ], function(err, result) {
      if (err) {
        toast(err.message, 1500);
        return;
      }

      self.renderMainPanel(result);
    });
  },
  renderMainPanel: function(productInfo) {
    var self = this;

    this.cache.productInfo = productInfo;
    this.title = productInfo.title;
    this.updateNativeView(productInfo.title);

    $("<img>", {
      src: productInfo.img,
      alt: ""
    })
      .appendTo("#goods-main-img");

    $("#goods-desc").html(productInfo.desc || "");
    $(".js-points").text(productInfo.pprice);

    this.fixTpl();

    var buttonClass = "forbidden-color";

    async.waterfall([
      function(next) {
        appInfo.getUserData(function(err, userproductInfo) {
          if (err) {
            toast(err.message, 1500);
            return;
          }

          next(null, userproductInfo);
        });
      }
    ], function(err, result) {

      // 0: 正常兑换;
      // 1: 已结束;
      // 2: 未开始;
      // 3: 已兑完;
      // 4: 今日已兑完。
      if ( String(productInfo.stat) === "0" ) {
        buttonClass = "allow-color";

        self.$el.$exchangeButton.on("click", function() {
          if (result.userInfo.authcode) {
            self.$el.$shade.show();
            self.$el.$promptBoard.show();
          } else {
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
          }
        });

        self.$el.$promptBoard
          .on("click", ".js-confirm", function() {
            self.exchange({
              type: productInfo.type,
              thirdparturl: productInfo.thirdparturl || ""
            });
          })
          .on("click", ".js-cancel", function() {
            self.$el.$promptBoard.hide();
            self.$el.$shade.hide();
          });
      }

      self.$el.$exchangeButton
        .text(productInfo.button)
        .addClass(buttonClass)
        .show();
    });
  },
  fixTpl: function() {
    var crTpl = require("app/client/mall/tpl/copyright.tpl");

    $("#copyright").html(crTpl({
      system: getSystem()
    }));
  },
  exchange: function(options) {

    // type：兑换类型    
    // 1--直接调用创建订单接口      
    // 2--转入输入手机号页面（预留）      
    // 3--转入输入地址页面（预留）   
    // 9--点击跳转第三方链接（ thirdparturl ）
    switch ( String(options.type) ) {
      case "1":
        this.$el.$promptBoard.hide();
        this.mallCreateOrder();
        break;
      case "2":
        this.$el.$shade.hide();
        this.$el.$promptBoard.hide();
        this.router.switchTo("form-phone");
        break;
      case "9":
        window.location.href = options.thirdparturl;
        break;
    }
  },
  mallCreateOrder: function() {
    var self = this;

    async.waterfall([
      function(next) {
        appInfo.getUserData(function(err, userData) {
          if (err) {
            toast(err.message, 1500);
            return;
          }

          next(null, userData);
        });
      },
      function(userData, next) {
        var params = _.extend({}, userData.userInfo, {
          p: userData.deviceInfo.p,
          productid: parseUrl().productid
        });

        sendPost("createOrder", params, function(err, data) {
          next(err, data);
        });
      }
    ], function(err, result) {
      if (err) {
        self.$el.$promptFail
          .one("click", ".js-close", function() {
            self.$el.$promptFail.hide();
            self.$el.$shade.hide();
          })
          .find(".js-message")
            .html(err.message)
          .end()
          .show();
        return;
      }

      self.$el.$promptSuccess
        .one("click", ".js-goto-order-detail", function() {
          window.location.href = "/fe/app/client/mall/html/detail-page/order-detail.html" +
            "?orderid=" + result.orderid;
        })
        .find(".js-message")
          .html(result.message)
        .end()
        .show();
    });
  },
  updateNativeView: function(title) {
    NativeAPI.invoke("updateTitle", {
      text: title
    });

    // NativeAPI.invoke("updateHeaderRightBtn", {
    //   action: "show",
    //   icon: require("app/client/mall/image/share-icon.js"),
    //   text: "分享"
    // }, function(err) {
    //   if (err) {
    //     toast(err.message);
    //     return;
    //   }
    // });

    // NativeAPI.registerHandler("headerRightBtnClick", function() {
    //   window.location.href = "gtgj://start?type=share";
    // });
  },
  init: function() {
    if (this.title) {
      this.updateNativeView(this.title);
    }
  }
});

module.exports = AppView;
