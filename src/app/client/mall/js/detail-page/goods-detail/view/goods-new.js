var $           = require("jquery");
var _           = require("lodash");
var async       = require("async");
var NativeAPI   = require("app/client/common/lib/native/native-api.js");
var sendPost    = require("app/client/mall/js/lib/mall-request.js").sendPost;
var appInfo     = require("app/client/mall/js/lib/app-info.js");
var toast       = require("com/mobile/widget/hint/hint.js").toast;
var hint        = require("com/mobile/widget/hint/hint.js");
var UrlUtil     = require("com/mobile/lib/url/url.js");
var widget      = require("app/client/mall/js/lib/common.js");
var mallUitl    = require("app/client/mall/js/lib/util.js");
var addressUtil = require("app/client/mall/js/lib/address-util.js");
var loadScript  = require("com/mobile/lib/load-script/load-script.js");
var cookie      = require("com/mobile/lib/cookie/cookie.js");
var shareUtil   = require("com/mobile/widget/wechat/util.js");
var wechatUtil  = require("com/mobile/widget/wechat-hack/util.js");
var mallWechat  = require("app/client/mall/js/lib/wechat.js");
var detailLog   = require("app/client/mall/js/lib/common.js").initTracker("detail");
var Popover     = require("com/mobile/widget/popover/popover.js");
var pageAction  = require("app/client/mall/js/lib/page-action.js");
var ui          = require("app/client/mall/js/lib/ui.js");
var tplUtil     = require("app/client/mall/js/lib/mall-tpl.js");
var BaseView    = require("app/client/mall/js/common/views/BaseView.js");
var FooterView  = require("app/client/mall/js/common/views/footer.js");
var BuyPanelView = require("app/client/mall/js/common/views/pay/buy-num-panel.js");
var BuyNumModel  = require("app/client/mall/js/common/models/buy-num-model.js");

var AppView = BaseView.extend({
  el: "#goods-detail",
  events: {
    "click .js-new-page"  : "createNewPage",
    "click .js-get-url"   : "handleGetUrl",
    "click .js-webview a" : "createNewPage",
    "click .js-privilege" : "showPrivilegePanel",
    "click .js-coupon"    : "showCouponPanel",
    "click .js-detail-bar": "showDetailInfo"
  },
  initialize: function(commonData) {
    _.extend(this, commonData);
    this.buyNumModel = new BuyNumModel();
    this.model.buyNumModel = this.buyNumModel;
    this.payView = new BuyPanelView({
      model: this.buyNumModel,
      buy: function() {this.buy();}.bind(this),
      pay: function() {this.pay();}.bind(this)
    });
    this.$initial = ui.initial();

    this.resetAppView = false;
    this.title = "";
    this.userDataOpitons = { reset: false };
    this.action = UrlUtil.parseUrlSearch().action;
    this.mallGoodsDetail();
  },
  resume: function() {
    this.$initial.show();

    if (this.title) {
      widget.updateViewTitle(this.title);
      this.$initial.hide();
      detailLog({
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

        sendPost("goodsDetail", params, function(err, data) {
          next(err, data);
        });
      }
    ], function(err, result) {
      if (err) {
        toast(err.message, 1500);
        return;
      }

      self.render(result);
      self.$initial.hide();
    });
  },
  showPrivilegePanel: function() {
    this.$privilegePanel.show();
  },
  showCouponPanel: function() {
    this.$couponPanel.show();
  },
  showDetailInfo: function() {
    this.router.switchTo("goods-desc");
  },
  renderPrivilegePanle: function(data) {
    var self = this;
    var tmpl = require("app/client/mall/tpl/detail-page/goods-privilege.tpl");
    this.$privilegePanel = $(tmpl({ item: data })).hide().appendTo(this.$el);
    this.$privilegePanel.on("click", function() {
      self.$privilegePanel.hide();
    });
  },
  renderCouponPanel: function(data) {
    var self = this;
    var tmpl = require("app/client/mall/tpl/detail-page/goods-coupon.tpl");
    this.$couponPanel = $(tmpl({ couponList: data })).hide().appendTo(this.$el);
    this.$couponPanel.on("click", function() {
      self.$couponPanel.hide();
    });
  },
  renderGoodsInfo: function(goods) {

    // View: goods info
    var mainTmpl = require("app/client/mall/tpl/detail-page/goods-detail.tpl");

    goods.tplUtil = tplUtil;
    this.$el.html(mainTmpl(goods));

    // View: copyright
    new FooterView().render();

    if (this.privilege) {
      this.renderPrivilegePanle(this.privilege);
    }

    if (this.couponList) {
      this.renderCouponPanel(this.couponList);
    }
  },
  render: function(goods) {

    // router: use it as backbone view cache
    this.cache.goods = goods;

    this.title = goods.title;
    widget.updateViewTitle(goods.title);

    // 一元夺宝特权券
    if (goods.userprivilresp && goods.userprivilresp.privilid) {
      this.privilid = goods.userprivilresp.privilid;
      this.privilprice = goods.userprivilresp.privilprice;
      this.privilege = goods.userprivilresp;
    }

    // 商品优惠券
    if (goods.couponrecords && goods.couponrecords.length > 0) {
      this.couponList = goods.couponrecords;
    }

    this.renderGoodsInfo(goods);
    this.renderBuyNumView(goods);

    if (goods.wechatshare) {
      wechatUtil.setShareInfo(goods.wechatshare);
    }

    if ( UrlUtil.parseUrlSearch().gotoView ) {
      this.router.switchTo( UrlUtil.parseUrlSearch().gotoView );
    } else {
      if ( wechatUtil.isWechatFunc() ) {
        wechatUtil.setTitle(goods.title);
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

    detailLog({
      title: goods.title,
      productid: UrlUtil.parseUrlSearch().productid,
      from: UrlUtil.parseUrlSearch().from || "--"
    });
  },

  renderBuyNumView: function (goods) {
    this.buyNumModel.set({
      type: 0,
      hasMask: false,
      visible: true,
      title: "购买数量",
      payText: goods.button,
      payNumText: goods.button; //goods.money > 0 ? "去支付" : "立即兑换",
      points: goods.points,
      price: goods.money,
      limitNum: goods.limit,
      canPay: goods.stat === 0,
      parentDom: "#goods-detail"
    });
  },

  buy: function () {
    // 购买上限为1的情况
    if(this.buyNumModel.get("limitNum") === 1) {
      return this.pay();
    }
    return this.buyNumModel.set({
      type: 1,
      hasMask: true
    });
  },

  pay: function() {
    this.exchangeHandler();
  },

  exchangeHandler: function() {
    var self = this;
    var appName = cookie.get("appName");
    var goods = this.cache.goods;

    if ( /hbgj/i.test(appName) || /gtgj/i.test(appName) ) {
      if ( String(goods.stat) !== "0" ) {
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
          switch ( String(goods.type) ) {
            case "1":
              self.exchange();
              break;
            case "2":
              self.router.switchTo("form-phone");
              return;
            case "3":
              self.gotoAddress();
              return;
            case "9":
              self.gotoNewView({
                url: goods.thirdparturl
              });
              return;
            case "13":
              self.router.switchTo("form-custom");
              return;
          }
        } else {
          self.loginApp();
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

  exchange: function() {
    if(this.buyNumModel.get("type") === 0) { // 不能选择数量的情况 需要弹出提示
      var titleText = this.cache.goods.confirm || "是否确认兑换？";

      // 确认兑换弹窗
      var confirm = new Popover({
        type: "confirm",
        title: titleText,
        message: "",
        agreeText: "确定",
        cancelText: "取消",
        agreeFunc: function() {
          this.mallCreateOrder();
        }.bind(this),
        cancelFunc: function() {}
      });
      confirm.show();
      return;
    }
    return this.mallCreateOrder();
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
  mallCreateOrder: function() {
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
          productid: UrlUtil.parseUrlSearch().productid,
          num: self.buyNumModel.get("number")
        });

        if (self.privilid) {
          params.privilid = self.privilid;
          params.privilprice = self.privilprice;
        }

        sendPost("createOrder", params, function(err, data) {
          next(err, data);
        });
      }
    ], function(err, result) {
      if (err) {
        hint.hideLoading();
        var alertOptions = {
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
        };
        if(self.errAlert){
          self.errAlert.model.set(alertOptions);
        }else{
          self.errAlert = new Popover(alertOptions);
        }
        self.errAlert.show();
        return;
      }

      self.handleCreateOrder(result);
    });
  },
  handleCreateOrder: function(orderInfo) {
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
            price: orderInfo.payprice,
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
