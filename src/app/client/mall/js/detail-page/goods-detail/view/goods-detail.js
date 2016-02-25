var $           = require("jquery");
var Backbone    = require("backbone");
var _           = require("lodash");
var async       = require("async");
var NativeAPI   = require("app/client/common/lib/native/native-api.js");
var sendPost    = require("app/client/mall/js/lib/mall-request.js").sendPost;
var appInfo     = require("app/client/mall/js/lib/app-info.js");
var toast       = require("com/mobile/widget/hint/hint.js").toast;
var hint        = require("com/mobile/widget/hint/hint.js");
var UrlUtil     = require("com/mobile/lib/url/url.js");
var Util        = require("com/mobile/lib/util/util.js");
var widget      = require("app/client/mall/js/lib/widget.js");
var mallUitl    = require("app/client/mall/js/lib/util.js");
var addressUtil = require("app/client/mall/js/lib/address-util.js");
var loadScript  = require("com/mobile/lib/load-script/load-script.js");
var cookie      = require("com/mobile/lib/cookie/cookie.js");
var shareUtil   = require("com/mobile/widget/wechat/util.js");
var wechatUtil  = require("com/mobile/widget/wechat-hack/util.js");
var mallWechat  = require("app/client/mall/js/lib/wechat.js");
var detailLog   = require("app/client/mall/js/detail-page/lib/log.js");
var Popover     = require("com/mobile/widget/popover/popover.js");
var pageAction  = require("app/client/mall/js/lib/page-action.js");

var AppView = Backbone.View.extend({
  el: "#goods-detail",
  events: {
    "click #goods-desc a"      : "createNewPage",
    "click .js-exchange-button": "exchangeHandler"
  },
  initialize: function() {
    this.resetAppView = false;
    this.title = "";
    this.userDataOpitons = { reset: false };
    this.$el.$exchangeButton = $("#goods-detail .js-exchange-button");
    this.mallGoodsDetail();
  },
  resume: function() {
    if (this.title) {
      widget.updateViewTitle(this.title);

      detailLog.track({
        title: this.title,
        productid: UrlUtil.parseUrlSearch().productid,
        from: UrlUtil.parseUrlSearch().from || "--"
      });
    }

    if (this.resetAppView) {
      pageAction.showRightButton({ text: "分享" });
    }

    hint.hideLoading();
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
          imei: userData.deviceInfo.imei,
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
    });
  },
  renderMainPanel: function(productInfo) {

    // router: use it as backbone view cache
    this.cache.productInfo = productInfo;
    this.title = productInfo.title;
    widget.updateViewTitle(productInfo.title);

    $("<img>", {
      src: productInfo.img,
      alt: ""
    })
      .appendTo("#goods-main-img");

    $("#goods-desc").html(productInfo.desc || "");
    $(".js-points").html(productInfo.pprice);

    this.fixTpl();

    if ( UrlUtil.parseUrlSearch().gotoView ) {
      this.router.switchTo( UrlUtil.parseUrlSearch().gotoView );
    } else {
      var buttonClass = "forbidden-color";

      // 0: 正常兑换;
      // 1: 已结束;
      // 2: 未开始;
      // 3: 已兑完;
      // 4: 今日已兑完。
      if ( String(productInfo.stat) === "0" ) {
        buttonClass = "allow-color";
      }

      this.$el.$exchangeButton
        .text(productInfo.button)
        .addClass(buttonClass)
        .show();

      if ( wechatUtil.isWechatFunc() ) {
        wechatUtil.setTitle(productInfo.title);
        if ( shareUtil.hasShareInfo() ) {
          loadScript(window.location.origin + "/fe/com/mobile/widget/wechat/wechat.bundle.js");
        }
      } else if ( shareUtil.hasShareInfo() ) {
        mallWechat.initNativeShare();
        this.resetAppView = true;
      }

      var isApp = mallUitl.isAppFunc();

      if ( !isApp ) {
        require("app/client/mall/js/lib/download-app.js").init( isApp );
      }
    }

    detailLog.track({
      title: productInfo.title,
      productid: UrlUtil.parseUrlSearch().productid,
      from: UrlUtil.parseUrlSearch().from || "--"
    });
  },
  exchangeHandler: function() {
    var self = this;
    var appName = cookie.get("appName");
    var productInfo = this.cache.productInfo;

    if ( /hbgj/i.test(appName) || /gtgj/i.test(appName) ) {
      if ( String(productInfo.stat) !== "0" ) {
        return;
      }

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

          // type：兑换类型
          // 1--直接调用创建订单接口
          // 2--转入输入手机号页面（预留，金融类）
          // 3--转入输入地址页面（预留）
          // 9--点击跳转第三方链接（ thirdparturl ）
          // 13--转入自定义表单页面
          switch ( String(productInfo.type) ) {
            case "2":
              self.router.switchTo("form-phone");
              return;
            case "3":
              self.gotoAddress();
              return;
            case "9":
              self.gotoNewView({
                url: productInfo.thirdparturl
              });
              return;
            case "13":
              self.router.switchTo("form-custom");
              return;
            default:
              var titleText = productInfo.confirm || "是否确认兑换？";

              // 确认兑换弹窗
              var confirm = new Popover({
                type: "confirm",
                title: titleText,
                message: "",
                agreeText: "确定",  
                cancelText: "取消",
                agreeFunc: function() {
                  self.exchange(productInfo);
                },
                cancelFunc: function() {}
              });
              confirm.show();
              return;
          }
        } else {
          // 登录弹窗
          new Popover({
            type: "confirm",
            title: "提　示",
            message: "您尚未登录，登录后即可兑换！",
            agreeText: "确定",
            cancelText: "取消",
            agreeFunc: function() {
              self.loginApp();
            },
            cancelFunc: function() {}
          })
            .show();
        }
      });
    } else {
      if ( /hb/.test(window.location.hostname) ) {
        window.location.href = mallUitl.getHangbanAppUrl();
      } else {
        window.location.href = mallUitl.getGaotieAppUrl();
      }
    }
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
      isHangbanFunc: mallUitl.isHangbanFunc()
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
        this.mallCreateOrder(productInfo);
        break;
      case "2":
        this.router.switchTo("form-phone");
        break;
      case "3":
        this.gotoAddress();
        break;
      case "9":
        this.gotoNewView({
          url: productInfo.thirdparturl
        });
        break;
      case "13":
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

        var alert = new Popover({
          type: "alert",
          title: "兑换失败",
          message: err.message,
          agreeText: "确定",  
          agreeFunc: function() {
            // version 3.1 未实现 startPay 接口
            if (err.code === -99) {
              window.location.href = mallUitl.getUpgradeUrl();
            }
          }
        });
        alert.show();
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

          if ( mallUitl.isHangbanFunc() ) {
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
        var alert = new Popover({
          type: "alert",
          title: "兑换成功",
          message: orderInfo.message,
          agreeText: "查看订单",  
          agreeFunc: function() {
            self.gotoNewView({
              url: orderDetailUrl
            });
          }
        });
        alert.show();
      }

      hint.hideLoading();
    });
  },
  gotoNewView: function(options) {
    widget.createNewView(options);
  }
});

module.exports = AppView;
