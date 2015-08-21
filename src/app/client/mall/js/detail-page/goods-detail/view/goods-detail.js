var $          = require("jquery");
var Backbone   = require("backbone");
var _          = require("lodash");
var async      = require("async");
var NativeAPI  = require("app/client/common/lib/native/native-api.js");
var sendPost   = require("app/client/mall/js/lib/mall-request.js").sendPost;
var appInfo    = require("app/client/mall/js/lib/app-info.js");
var toast      = require("com/mobile/widget/hint/hint.js").toast;
var hint       = require("com/mobile/widget/hint/hint.js");
var UrlUtil    = require("com/mobile/lib/url/url.js");
var Util       = require("com/mobile/lib/util/util.js");
var widget     = require("app/client/mall/js/lib/widget.js");
var mallUitl   = require("app/client/mall/js/lib/util.js");
var addressUtil = require("app/client/mall/js/lib/address-util.js");
// var loadScript = require("com/mobile/lib/load-script/load-script.js");
// var cookie     = require("com/mobile/lib/cookie/cookie.js");
// var shareUtil  = require("com/mobile/widget/wechat/util.js");
// var wechatUtil = require("com/mobile/widget/wechat-hack/util.js");
// var mallWechat = require("app/client/mall/js/lib/wechat.js");

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
  resume: function() {
    if (this.title) {
      this.updateNativeView(this.title);
    }

    hint.hideLoading();
  },
  createNewPage: function(e) {
    widget.createAView(e);

    // var appName = cookie.get("appName");

    // if ( /hbgj/i.test(appName) || /gtgj/i.test(appName) ) {
    //   widget.createAView(e);
    // } else {
    //   window.location.href = "http://a.app.qq.com/o/simple.jsp?pkgname=com.flightmanager.view";
    // }
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
          productid: UrlUtil.parseUrlSearch().productid
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

      // if ( wechatUtil.isWechat() ) {
      //   wechatUtil.setTitle(result.title);
      //   if ( shareUtil.hasShareInfo() ) {
      //     loadScript(window.location.origin + "/fe/com/mobile/widget/wechat/wechat.bundle.js");
      //   }
      // } else if ( mallUitl.isHangban() ) {
      //   mallWechat.initNativeShare();
      // }
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
    });
  },
  fixTpl: function() {
    var crTpl = require("app/client/mall/tpl/copyright.tpl");

    $("#copyright").html(crTpl({
      system: Util.getMobileSystem(),
      isHangban: mallUitl.isHangban()
    }));
  },
  exchange: function(productInfo) {

    // type：兑换类型
    // 1--直接调用创建订单接口
    // 2--转入输入手机号页面（预留，金融类）
    // 3--转入输入地址页面（预留）
    // 9--点击跳转第三方链接（ thirdparturl ）
    // 13--转入输入手机号页面（预留，金融类）
    switch ( String(productInfo.type) ) {
      case "1":
        this.$el.$promptBoard.hide();
        this.mallCreateOrder(productInfo);
        break;
      case "2":
        this.hidePrompt();
        this.router.switchTo("form-phone");
        break;
      case "3":
        this.hidePrompt();
        this.gotoAddress();
        break;
      case "9":
        this.gotoNewView({
          url: productInfo.thirdparturl
        });
        break;
      case "13":
        this.hidePrompt();
        this.router.switchTo("form-custom");
        break;
    }
  },
  gotoAddress: function() {
    var self = this;

    hint.showLoading();

    addressUtil.getList(function(err, result) {
      if (err) {
        toast(err.message, 1500);
        return;
      }

      var AddressList = require("app/client/mall/js/detail-page/goods-detail/collection/address-list.js");
      var addressList = new AddressList();

      if (result.length > 0) {
        addressList.add(result);
      }
      
      self.collection.addressList = addressList;
      hint.hideLoading();

      if (result.length === 0) {
        self.router.switchTo("address-add");
      } else {
        self.router.switchTo("address-confirm");
      }
    });
  },
  mallCreateOrder: function(productInfo) {
    var self = this;

    hint.showLoading();

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
          productid: UrlUtil.parseUrlSearch().productid
        });

        sendPost("createOrder", params, function(err, data) {
          next(err, data);
        });
      }
    ], function(err, result) {
      if (err) {
        hint.hideLoading();

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
          var payUrl = window.location.origin + "/bmall/payview.do?orderid=" + orderInfo.orderid;

          if ( mallUitl.isHangban() ) {
            payUrl = window.location.origin + "/bmall/hbpayview.do?orderid=" + orderInfo.orderid;
          }

          // quitpaymsg  String 退出时候的提示
          // title       String 支付标题
          // price       String 商品价格
          // orderid     String 订单号
          // productdesc String 商品描述
          // url         String 显示订单基本信息的Wap页面
          // subdesc     String 商品详情描述
          var payParams = {
            quitpaymsg: "您尚未完成支付，如现在退出，可稍后进入“全部订单->订单详情”完成支付。确认退出吗？",
            title: "支付订单",
            price: productInfo.mprice,
            orderid: orderInfo.payorderid,
            productdesc: orderInfo.paydesc,
            url: payUrl,
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

      var orderDetailUrl = window.location.origin +
          "/fe/app/client/mall/html/detail-page/order-detail.html" +
          "?orderid=" + orderInfo.orderid;

      if (result) {
        self.gotoNewView({
          url: orderDetailUrl
        });
      } else {
        self.$el.$shade.show();
        self.$el.$promptSuccess
          .one("click", ".js-goto-order-detail", function() {
            self.gotoNewView({
              url: orderDetailUrl
            });
          })
          .find(".js-message")
            .html(orderInfo.message)
          .end()
          .show();
      }

      hint.hideLoading();
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
    window.document.title = title;
    NativeAPI.invoke("updateTitle", {
      text: title
    });
  }
});

module.exports = AppView;
