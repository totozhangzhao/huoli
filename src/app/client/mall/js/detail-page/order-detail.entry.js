var $         = require("jquery");
var _         = require("lodash");
var Backbone  = require("backbone");
var async     = require("async");
var NativeAPI = require("app/client/common/lib/native/native-api.js");
var sendPost  = require("app/client/mall/js/lib/mall-request.js").sendPost;
var toast     = require("com/mobile/widget/hint/hint.js").toast;
var hint      = require("com/mobile/widget/hint/hint.js");
var appInfo   = require("app/client/mall/js/lib/app-info.js");
var parseUrl  = require("com/mobile/lib/url/url.js").parseUrlSearch;
var Util      = require("com/mobile/lib/util/util.js");
var widget    = require("app/client/mall/js/lib/common.js");
var mallUitl  = require("app/client/mall/js/lib/util.js");
var pageAction = require("app/client/mall/js/lib/page-action.js");
var logger     = require("com/mobile/lib/log/log.js");
var mallUitl   = require("app/client/mall/js/lib/util.js");
var storage    = require("app/client/mall/js/lib/storage.js");
var tplUtil    = require("app/client/mall/js/lib/mall-tpl.js");
var orderLog   = require("app/client/mall/js/lib/common.js").initTracker("order");
var ui         = require("app/client/mall/js/lib/ui.js");
var FooterView = require("app/client/mall/js/common/views/footer.js");


var BuyNumModel     = require("app/client/mall/js/common/models/buy-num-model.js");
var BuyPanelView = require("app/client/mall/js/common/views/pay/buy-num-panel.js");

var AppView = Backbone.View.extend({
  el: "#order-detail-container",
  events: {
    "click a"              : "createNewPage",
    "touchstart .js-copy"  : "copyText",
    "click .js-crowd-page" : "gotoCrowd",
    "click .js-address-box": "handleAddressInfo"
  },
  initialize: function() {
    NativeAPI.invoke("updateTitle", {
      text: "订单详情"
    });
    this.buyNumModel = new BuyNumModel();
    this.payView = new BuyPanelView({
      model: this.buyNumModel,
      buy: function() {this.buy();}.bind(this),
      pay: function() {}
    });
    this.$initial = ui.initial().show();
    this.orderDetail = {};
    this.isPaying = false;
    this.mallOrderDetail();
    pageAction.setClose();
    logger.track(mallUitl.getAppName() + "PV", "View PV", document.title);
  },
  copyText: function(e) {
    var $text = $(e.currentTarget).find(".js-copy-text");

    if ( $text.length !== 1 ) {
      return;
    }

    NativeAPI.invoke("copyToClipboard", {
      text: $text.text()
    }, function(err, data) {
      if (err) {
        return;
      }

      if (data.value === data.SUCC) {
        toast("复制成功", 1500);
      }
    });
  },
  handleAddressInfo: function() {
    var needpay = this.orderDetail.needpay;

    if (needpay === 2) {
      this.gotoAddressList();
    } else {
      this.gotoExpressInfoView();
    }
  },
  gotoAddressList: function() {
    var id = this.orderDetail.orderid;
    var url = "/fe/app/client/mall/html/detail-page/goods-detail.html" +
        "?action=order&orderid=" + id +
        "#address-list";

    window.location.href = url;
  },
  gotoExpressInfoView: function() {
    var expressInfo = this.orderDetail.express;

    if (!expressInfo) {
      return;
    }

    // companyid: 快递公司id
    // company：快递公司名称
    // tracking: 快递单号
    var url = "/fe/app/client/mall/html/detail-page/express-info.html" +
      "?tracking="  + expressInfo.tracking +
      "&company="   + encodeURIComponent(expressInfo.company) +
      "&companyid=" + expressInfo.companyid;

    widget.createNewView({ url: url });
  },
  gotoCrowd: function() {
    var url = tplUtil.getBlockUrl({ action: 6 }) +
      "?productid=" + this.orderDetail.productid;

    widget.createNewView({ url: url });
  },
  createNewPage: function(e) {
    widget.createAView(e);
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
          orderid: parseUrl().orderid
        });

        sendPost("orderNewDetail", params, function(err, data) {
          if (err) {
            next(err);
            return;
          }

          next(null, data);
        });
      }
    ], function(err, result) {
      if (err) {
        toast(err.message, 1500);
        return;
      }

      self.orderDetail = result;

      var compiled = require("app/client/mall/tpl/detail-page/order-detail.tpl");
      var tmplData = {
        orderDetail: self.orderDetail
      };

      $("#order-detail-container").html( compiled(tmplData) );
      self.renderBuyNumView(result);
      new FooterView().render();
      self.$initial.hide();
      orderLog({
        title: self.orderDetail.title,
        from: parseUrl().from || "--"
      });
    });
  },

  renderBuyNumView: function (order) {
    if(order.needpay !== 1){
      return;
    }
    this.buyNumModel.set({
      type:0,
      hasMask: false,
      visible: true,
      payText:"去支付",
      points: order.points,
      price: order.money,
      canPay: true,
      parentDom: "#order-detail-container"
    });
  },
  buy: function () {
    this.payOrder();
  },
  payOrder: function() {
    var self = this;

    if (this.isPaying) {
      return;
    }

    hint.showLoading();

    var orderDetail = this.orderDetail;

    if (!orderDetail.needpay) {
      toast("此订单不是需要支付的状态", 1500);
      return;
    }

    this.isPaying = true;

    async.waterfall([
      function(next) {
        var payUrl = window.location.origin + "/bmall/payview.do?orderid=" + orderDetail.orderid;

        if ( mallUitl.isHangbanFunc() ) {
          payUrl = window.location.origin + "/bmall/hbpayview.do?orderid=" + orderDetail.orderid;
        }

        // orderid: 订单ID
        // createtime: 创建时间
        // statusstr: 状态显示串
        // productid: 产品id
        // stattpl: 状态模板（数字型，1: 完成订单模板  2: 失败订单模板  3: 待支付模板）
        // orderprice: 订单价格
        // msgtpl: 信息区模板（数字型，0: 不显示 1: 电子码模板， 2: 第三方用户名（包括电话号码）模板，3: 地址模板）
        // msg: 信息区内容
        // img: 图片url
        // title: 商品标题
        // shotdesc: 商品短描述
        // price: 商品价格
        // note: 使用说明
        // needpay: 是否需要支付，1: 需要，0: 不需要，2: 补全地址
        // payprice: 支付价格
        // payorderid: 支付订单ID
        if (orderDetail.needpay) {

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
            price: orderDetail.payprice,
            orderid: orderDetail.payorderid,
            productdesc: orderDetail.title,
            url: payUrl,
            subdesc: orderDetail.shotdesc
          };

          NativeAPI.invoke("startPay", payParams, function(err, payData) {
            next(err, payData);
          });
        } else {
          next(null, null);
        }
      },
      function(payData, next) {
        storage.get("mallInfo", function(data) {
          data = data || {};
          next(null, payData, data);
        });
      },
      function(payData, data, next) {
        data.status = data.status || {};
        data.status.orderChanged = true;
        storage.set("mallInfo", data, function() {
          next(null, payData);
        });
      }
    ], function() {
      self.isPaying = false;
      // hint.hideLoading();
      window.location.reload();
    });
  }
});

new AppView();
