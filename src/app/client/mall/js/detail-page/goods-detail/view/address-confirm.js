// var $          = require("jquery");
var Backbone   = require("backbone");
var _          = require("lodash");
var async      = require("async");
var appInfo    = require("app/client/mall/js/lib/app-info.js");
var NativeAPI  = require("app/client/common/lib/native/native-api.js");
var sendPost   = require("app/client/mall/js/lib/mall-request.js").sendPost;
var toast      = require("com/mobile/widget/hint/hint.js").toast;
var hint       = require("com/mobile/widget/hint/hint.js");
var widget     = require("app/client/mall/js/lib/common.js");
var pageAction = require("app/client/mall/js/lib/page-action.js");
var UrlUtil    = require("com/mobile/lib/url/url.js");
var mallUitl   = require("app/client/mall/js/lib/util.js");

var AppView = Backbone.View.extend({
  el: "#address-confirm",
  events: {
    "click #confirm-order": "confirmOrder",
    "click #address-entry": "selectAddress"
  },
  initialize: function() {
    this.curAddress = {};
  },
  resume: function(options) {
    if (options.previousView === "") {
      this.router.switchTo("goods-detail");
      pageAction.setClose();
      return;
    }

    pageAction.hideRightButton();

    if (options.previousView !== "goods-detail") {
      pageAction.setClose();
    }

    var curAddressId = this.cache.curAddressId;
    var addressList = this.collection.addressList;
    
    if (curAddressId) {
      this.cache.curAddressId = null;
      this.curAddress = addressList.get(curAddressId).toJSON();
    } else if (addressList.length > 0) {
      this.curAddress = addressList.at(0).toJSON();
    }

    this.initView(this.curAddress);
  },
  initView: function(addressInfo) {
    var addressListTpl = require("app/client/mall/tpl/detail-page/address-confirm.tpl");

    this.$el.html(addressListTpl({
      addressInfo: addressInfo,
      productInfo: this.cache.productInfo
    }));
  },
  selectAddress: function() {
    this.router.switchTo("address-list");
  },
  confirmOrder: function() {
    hint.showLoading();
    this.mallCreateOrder(this.cache.productInfo);
  },
  mallCreateOrder: function(productInfo) {
    var self = this;

    async.waterfall([
      function(next) {
        appInfo.getUserData(function(err, userData) {
          if (err) {
            next(err);
            return;
          }

          next(null, userData);
        });
      },
      function(userData, next) {
        var params = _.extend({}, userData.userInfo, {
          p: userData.deviceInfo.p,
          productid: UrlUtil.parseUrlSearch().productid,
          address: self.curAddress
        });

        sendPost("createOrder", params, function(err, data) {
          next(err, data);
        });
      }
    ], function(err, result) {
      if (err) {
        toast(err.message, 1500);
        return;
      }

      self.handleCreateOrder(result, productInfo);
    });
  },
  handleCreateOrder: function(orderInfo, productInfo) {
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
    ], function(err) {
      if (err) {
        toast(err.message, 1500);
        return;
      }

      var orderDetailUrl = window.location.origin +
          "/fe/app/client/mall/html/detail-page/order-detail.html" +
          "?orderid=" + orderInfo.orderid;

      widget.createNewView({
        url: orderDetailUrl
      });

      hint.hideLoading();
    });
  }
});

module.exports = AppView;
