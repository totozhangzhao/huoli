var $          = require("jquery");
var _          = require("lodash");
var Backbone   = require("backbone");
var async      = require("async");
var NativeAPI  = require("app/client/common/lib/native/native-api.js");
var sendPost   = require("app/client/mall/js/lib/mall-request.js").sendPost;
var toast      = require("com/mobile/widget/toast/toast.js");
var appInfo    = require("app/client/mall/js/lib/app-info.js");
var parseUrl   = require("com/mobile/lib/url/url.js").parseUrlSearch;
var Util       = require("com/mobile/lib/util/util.js");
var widget     = require("app/client/mall/js/lib/widget.js");
var mallUitl   = require("app/client/mall/js/lib/util.js");

var AppView = Backbone.View.extend({
  el: "#order-detail-container",
  events: {
    "click a": "createNewPage",
    "click #pay-button": "payOrder"
  },
  initialize: function() {
    NativeAPI.invoke("updateTitle", {
      text: "订单详情"
    });

    this.orderDetail = {};
    this.mallOrderDetail();
    this.isPaying = false;
  },
  createNewPage: function(e) {
    widget.createAView(e);
  },
  payOrder: function() {
    var self = this;

    if (this.isPaying) {
      return;
    }

    var orderDetail = this.orderDetail;

    if (!orderDetail.needpay) {
      toast("此订单不是需要支付的状态", 1500);
      return;
    }

    this.isPaying = true;

    async.waterfall([
      function(next) {
        var payUrl = window.location.origin + "/bmall/payview.do?orderid=" + orderDetail.orderid;

        if ( mallUitl.isHangban() ) {
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
        // needpay: 是否需要支付，1: 需要，0: 不需要
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
            quitpaymsg: "您尚未完成支付，如现在退出，可稍后进入“兑换记录->订单详情”完成支付。确认退出吗？",
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
      }
      // function(payData, next) {
      //   if (!payData) {
      //     next(null, null);
      //     return;
      //   }

      //   switch (payData.value) {
      //     case payData.SUCC:
      //       toast("支付成功", 1500);
      //       break;
      //     case payData.FAIL:
      //       toast("支付失败", 1500);
      //       break;
      //     case payData.CANCEL:
      //       toast("您取消了支付", 1500);
      //       break;
      //     default:
      //       toast("支付异常", 1500);
      //   }

      //   if (payData.value === payData.SUCC) {
      //     next(null, null);
      //     return;
      //   } else {
      //     self.isPaying = false;
      //     return;
      //   }
      // }
    ], function() {
      self.isPaying = false;
      window.location.reload();
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

      self.fixTpl();
    });
  },
  fixTpl: function() {
    var crTpl = require("app/client/mall/tpl/copyright.tpl");

    $("#copyright").html(crTpl({
      system: Util.getMobileSystem()
    }));
  }
});

new AppView(); 
