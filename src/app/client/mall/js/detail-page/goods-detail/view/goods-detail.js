var $          = require("jquery");
var Backbone   = require("backbone");
var _          = require("lodash");
var async      = require("async");
var NativeAPI  = require("app/client/common/lib/native/native-api.js");
var requestAPI = require("app/client/mall/js/lib/request.js");
var appInfo    = require("app/client/mall/js/lib/appInfo.js");
var toast      = require("com/mobile/widget/toast/toast.js");
var parseUrl   = require("com/mobile/lib/url/url.js").parseUrlSearch;
var Util       = require("com/mobile/lib/util/util.js");
var updatePage = require("app/client/mall/js/lib/page-action.js").update;
var widget     = require("app/client/mall/js/lib/widget.js");
// var storage    = require("app/client/mall/js/lib/storage.js");
var mallUitl   = require("app/client/mall/js/lib/util.js");

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
    this.userDataOpitons = { reset: false };
    this.mallGoodsDetail();
  },
  createNewPage: function(e) {
    widget.createAView(e);
  },
  mallGoodsDetail: function() {
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
    this.cache.productInfo = productInfo;
    this.title = productInfo.title;
    this.updateNativeView(productInfo.title);

    $("<img>", {
      src: productInfo.img,
      alt: ""
    })
      .appendTo("#goods-main-img");

    $("#goods-desc").html(productInfo.desc || "");
    $(".js-points").html(productInfo.pprice);

    this.fixTpl();
    this.handlePrompt(productInfo);
  },
  handlePrompt: function(productInfo) {
    var self = this;
    var buttonClass = "forbidden-color";

    var exchangeHandler = function() {
      async.waterfall([
        function(next) {
          appInfo.getUserData(function(err, userData) {
            if (err) {
              toast(err.message, 1500);
              return;
            }

            next(null, userData);
          }, self.userDataOpitons);
        }
      ], function(err, result) {
        self.userDataOpitons.reset = false;

        if (result.userInfo.authcode) {
          self.$el.$shade.show();
          self.$el.$promptBoard.show();
        } else {
          self.$el.$shade.show();
          self.$el.$loginPrompt
            .one("click", ".js-confirm", function() {
              self.$el.$loginPrompt.hide();
              self.$el.$shade.hide();
              self.loginApp();
            })
            .one("click", ".js-cancel", function() {
              self.$el.$loginPrompt.hide();
              self.$el.$shade.hide();
            })
            .show();            
        }
      });
    };

    // 0: 正常兑换;
    // 1: 已结束;
    // 2: 未开始;
    // 3: 已兑完;
    // 4: 今日已兑完。
    if ( String(productInfo.stat) === "0" ) {
      buttonClass = "allow-color";

      this.$el.$exchangeButton.on("click", exchangeHandler);

      this.$el.$promptBoard
        .on("click", ".js-confirm", function() {
          self.exchange(productInfo);
        })
        .on("click", ".js-cancel", function() {
          self.$el.$promptBoard.hide();
          self.$el.$shade.hide();
        })
        .find(".js-title")
          .text(productInfo.confirm);
    }

    this.$el.$exchangeButton
      .text(productInfo.button)
      .addClass(buttonClass)
      .show();

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

        self.userDataOpitons.reset = true;
        self.updateIndexPage();
    });
  },
  updateIndexPage: function() {
    updatePage({
      isUpdate: true,
      url: window.location.origin + "/fe/app/client/mall/index.html" +
        "#_t=" + (new Date().getTime())
    });
  },
  fixTpl: function() {
    var crTpl = require("app/client/mall/tpl/copyright.tpl");

    $("#copyright").html(crTpl({
      system: Util.getMobileSystem()
    }));
  },
  exchange: function(productInfo) {

    // type：兑换类型    
    // 1--直接调用创建订单接口      
    // 2--转入输入手机号页面（预留）      
    // 3--转入输入地址页面（预留）   
    // 9--点击跳转第三方链接（ thirdparturl ）
    switch ( String(productInfo.type) ) {
      case "1":
        this.$el.$promptBoard.hide();
        this.mallCreateOrder(productInfo);
        break;
      case "2":
        this.$el.$shade.hide();
        this.$el.$promptBoard.hide();
        this.router.switchTo("form-phone");
        break;
      case "9":
        this.gotoNewView({
          url: productInfo.thirdparturl
        });
        break;
    }
  },
  mallCreateOrder: function(productInfo) {
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

            // version 3.1 未实现 startPay 接口
            if (err.code === -99) {
              window.location.href = mallUitl.getUpgradeUrl();
            }
          })
          .find(".js-message")
            .html(err.message)
          .end()
          .show();
        return;
      }

      self.handleCreateOrder(result, productInfo);
    });
  },
  handleCreateOrder: function(orderInfo, productInfo) {
    var self = this;

    async.waterfall([
      function(next) {
        if (String(orderInfo.paystatus) === "0" && orderInfo.payorderid) {

          // quitpaymsg  String 退出时候的提示
          // title       String 支付标题
          // price       String 商品价格
          // orderid     String 订单号
          // productdesc String 商品描述
          // url         String 显示订单基本信息的Wap页面
          // subdesc     String 商品详情描述
          var payParams = {
            quitpaymsg: "您尚未完成支付，如现在退出，可稍后进入“兑换记录->订单详情”完成支付。确认退出吗？",
            title: "支付订单",
            price: productInfo.mprice,
            orderid: orderInfo.payorderid,
            productdesc: orderInfo.paydesc,
            url: window.location.origin + "/bmall/payview.do?orderid=" + orderInfo.orderid,
            subdesc: orderInfo.paysubdesc
          };

          NativeAPI.invoke("startPay", payParams, function(err, payData) {
            next(err, payData);
          });

          _.defer(function() {
            self.hidePrompt();
          }, 300);
        } else {
          next(null, null);
        }
      }
    ], function(err, result) {
      if (err) {
        toast(err.message, 1500);
        return;
      }

      self.updateIndexPage();

      if (result) {
        var orderDetailUrl = window.location.origin +
            "/fe/app/client/mall/html/detail-page/order-detail.html" +
            "?orderid=" + orderInfo.orderid;

        if (false) {
          self.gotoNewView({
            url: orderDetailUrl
          });
        } else {
          window.location.href = orderDetailUrl;
        }
      } else {
        self.$el.$shade.show();
        self.$el.$promptSuccess
          .one("click", ".js-goto-order-detail", function() {
            self.gotoNewView({
              url: window.location.origin +
                "/fe/app/client/mall/html/detail-page/order-detail.html" +
                "?orderid=" + orderInfo.orderid
            });
          })
          .find(".js-message")
            .html(orderInfo.message)
          .end()
          .show();
      }
    });
  },
  hidePrompt: function() {
    var $el = this.$el;

    $el.find(".js-prompt").hide();
    $el.find(".js-shade").hide();
  },
  gotoNewView: function(options) {
    this.hidePrompt();
    widget.createNewView(options);
  },
  updateNativeView: function(title) {
    NativeAPI.invoke("updateTitle", {
      text: title
    });
  },
  init: function() {
    if (this.title) {
      this.updateNativeView(this.title);
    }
  }
});

module.exports = AppView;
