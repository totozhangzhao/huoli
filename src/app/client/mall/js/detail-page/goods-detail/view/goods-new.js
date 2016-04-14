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
var BaseView    = require("app/client/mall/js/common/views/BaseView.js");
var tplUtil     = require("app/client/mall/js/lib/mall-tpl.js");
var FooterView  = require("app/client/mall/js/common/views/footer.js");
var moneyModel  = require("app/client/mall/js/detail-page/goods-detail/model/money.js").money;

var AppView = BaseView.extend({
  el: "#goods-detail",
  events: {
    "click .js-new-page"       : "createNewPage",
    "click .js-get-url"        : "handleGetUrl",
    "click .js-webview a"      : "createNewPage",
    "click .js-detail-bar"     : "showDetailInfo",
    "click .js-pop-shadow"     : "hidePurchasePanel",
    "click .js-hide-panel"     : "hidePurchasePanel",
    "touchstart .js-change-num": "combo",
    "touchend .js-change-num"  : "setNum",
    "keyup .js-goods-num"      : "inputKeyUp",
    "keydown .js-goods-num"    : "inputKeyDown",
    "blur .js-goods-num"       : "inputBlur",
    "click .js-purchase"       : "submitButtonEvent"
  },
  initialize: function(commonData) {
    _.extend(this, commonData);

    this.$initial = ui.initial();
    this.$popShadow;
    this.$popPanel;
    this.$goodsNum;
    this.$button;

    this.comboMode = false;
    this.comboFuncTimer = null;

    // 购买数量上限
    // 每个订单可购数量
    // 0为不可购买
    // 大于1时则限制当前订单可购数量
    // 等于1时不多选
    this.limitNum = null;

    this.unitPoints = null;
    this.unitMoney = null;

    this.resetAppView = false;
    this.title = "";
    this.userDataOpitons = { reset: false };
    this.action = UrlUtil.parseUrlSearch().action;
    this.listenTo(moneyModel, "change", this.renderMoney);
    this.mallGoodsDetail();
  },
  showDetailInfo: function() {
    this.router.switchTo("goods-desc");
  },
  combo: function(e) {
    var self = this;

    if (this.comboMode) {
      return;
    }

    var emit = function() {
      setTimeout(function() {
        self.updateMoneyModel( $(e.currentTarget) );
        if (self.comboMode) {
          emit();
        }
      }, 100);
    };

    this.comboFuncTimer = setTimeout(function() {
      self.comboMode = true;
      emit();
    }, 500);
  },
  updateMoneyModel: function($button) {
    var number = Number( this.$goodsNum.val() );

    if ( $button.data("operator") === "add" ) {
      number += 1;
    } else {
      number -= 1;
    }

    this.checkNum(number);
  },
  checkNum: function (number) {
    var limitNum = this.limitNum;
    var minNum = 1;

    if ( number > limitNum ) {

      // 数量为 0 时应该点不开这个界面
      number = limitNum || 1;
      toast("已到单笔订单数量上限", 1500);
    } else if ( number < minNum ) {
      number = minNum;
    }

    moneyModel.set({
      num: number,
      _t: Date.now()
    });
  },
  renderMoney: function() {
    this.$goodsNum.val(moneyModel.get("num"));
    this.$el.find(".js-m-points").text(moneyModel.get("points") * moneyModel.get("num"));
    this.$el.find(".js-m-money").text(moneyModel.get("money") * moneyModel.get("num"));
  },
  inputKeyUp: function (e) {
    var val = parseInt( this.$goodsNum.val() ) || "";

    if ( isNaN(val) ) {
      return;
    }

    if (val !== "") {
      this.checkNum(val);
    }
  },

  inputBlur: function (e){
    var val = parseInt( this.$goodsNum.val() ) || 1;
    if ( isNaN(val) ) {
      return;
    }
    this.checkNum(val);
  },

  // 只能输入数字
  inputKeyDown: function (e) {
    if ( e.which !== 8 && (e.which < 48 || e.which > 57 ) ) {
      e.preventDefault();
      return;
    }
  },
  setNum: function(e) {
    this.comboMode = false;
    clearTimeout(this.comboFuncTimer);
    var $cur = $(e.currentTarget);
    this.updateMoneyModel($cur);
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

        sendPost("goodsDetail", params, function(err, data) {
          next(err, data);
        });
      }
    ], function(err, result) {
      if (err) {
        toast(err.message, 1500);
        return;
      }

      self.renderMainPanel(result);
      self.$initial.hide();
    });
  },
  renderNewGoods: function(goods) {

    // View: goods info
    var mainTmpl = require("app/client/mall/tpl/detail-page/goods-detail.tpl");

    goods.tplUtil = tplUtil;
    this.$el.html(mainTmpl(goods));

    // View: copyright
    new FooterView().render();
  },
  renderMainPanel: function(goods) {

    // router: use it as backbone view cache
    this.cache.goods = goods;

    this.title = goods.title;
    widget.updateViewTitle(goods.title);

    this.limitNum = goods.limit;
    this.unitPoints = goods.points;
    this.unitMoney = goods.money;

    this.renderNewGoods(goods);

    if (goods.wechatshare) {
      wechatUtil.setShareInfo(goods.wechatshare);
    }

    this.$popShadow = this.$el.find(".js-pop-shadow");
    this.$popPanel = this.$el.find(".js-pop-panel");
    this.$goodsNum = this.$el.find(".js-goods-num");
    this.$button = this.$el.find(".js-purchase");

    if ( UrlUtil.parseUrlSearch().gotoView ) {
      this.router.switchTo( UrlUtil.parseUrlSearch().gotoView );
    } else {
      var isDisabled = true;

      // 0: 正常兑换;
      // 1: 已结束;
      // 2: 未开始;
      // 3: 已兑完;
      // 4: 今日已兑完。
      if ( String(goods.stat) === "0" ) {
        isDisabled = false;
      }

      this.$button.prop("disabled", isDisabled);

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
  hidePurchasePanel: function(e) {
    var self = this;
    var $cur = $(e.currentTarget);

    var close = function() {
      self.$popShadow.hide();
      self.$button.text( self.$button.data("activeText") );
    };

    if ( $cur.hasClass("js-hide-panel") ) {
      close();
    } else if ( !$.contains(this.$popPanel.get(0), e.target) ) {
      close();
    }
  },
  showPurchasePanel: function() {
    var number = Number( this.$goodsNum.val() );
    moneyModel.set({
      points: this.unitPoints,
      money: this.unitMoney,
      num: number
    }, {
      silent: true
    });

    this.$popShadow.show();
    this.$button.text( this.$button.data("payText") );
  },
  submitButtonEvent: function() {
    if ( this.$popShadow.is(":visible") ) {
      this.exchangeHandler();
    } else {
      this.showPurchasePanel();
    }
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
            default:
              self.exchange(goods);
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
  exchange: function(goods) {

    // type：兑换类型
    // 1--直接调用创建订单接口
    // 2--转入输入手机号页面（预留，金融类）
    // 3--转入输入地址页面（预留）
    // 9--点击跳转第三方链接（ thirdparturl ）
    // 13--转入输入手机号页面（预留，金融类）
    switch ( String(goods.type) ) {
      case "1":
        this.mallCreateOrder(goods);
        break;
      case "2":
        this.router.switchTo("form-phone");
        break;
      case "3":
        this.gotoAddress();
        break;
      case "9":
        this.gotoNewView({
          url: goods.thirdparturl
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
  mallCreateOrder: function(goods) {
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
          num: Number( self.$goodsNum.val() )
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

      self.handleCreateOrder(result, goods);
    });
  },
  handleCreateOrder: function(orderInfo, goods) {
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
            price: goods.payprice,
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
