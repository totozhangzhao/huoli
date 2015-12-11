var $         = require("jquery");
var _         = require("lodash");
var Backbone  = require("backbone");
var toast     = require("com/mobile/widget/hint/hint.js").toast;
var hint      = require("com/mobile/widget/hint/hint.js");
var UrlUtil   = require("com/mobile/lib/url/url.js");
var logger    = require("com/mobile/lib/log/log.js");
var mallUitl  = require("app/client/mall/js/lib/util.js");
var appInfo   = require("app/client/mall/js/lib/app-info.js");
var sendPost  = require("app/client/mall/js/lib/mall-request.js").sendPost;
var NativeAPI = require("app/client/common/lib/native/native-api.js");
var Promise   = require("com/mobile/lib/promise/npo.js");
var moneyModel = require("app/client/mall/js/active-page/crowd/model/money.js").money;

var AppView = Backbone.View.extend({
  el: "#main-container",
  events: {
    "click .js-hide-panel": "hidePurchasePanel",
    "click .js-change-num": "setNum",
    "click .js-submit"    : "submitButtonEvent"
  },
  initialize: function() {

    // 单价
    this.unitPrice = 0;
    this.$panel;
    this.$button;
    this.listenTo(moneyModel, "change", this.renderMoney);
    this.mallCrowdDetail();
    logger.track(mallUitl.getAppName() + "PV", "View PV", document.title);
  },
  submitButtonEvent: function() {
    if ( this.$panel.is(":visible") ) {
      this.createOrder();
    } else {
      this.showPurchasePanel();
    }
  },
  showPurchasePanel: function() {
    this.$panel.show();
    this.$button.text( this.$button.data("payText") );
  },
  hidePurchasePanel: function() {
    this.$panel.hide();
    this.$button.text( this.$button.data("activeText") );
  },
  setNum: function(e) {
    var $cur = $(e.currentTarget);
    var $num = this.$el.find(".js-goods-num");
    var number = Number( $num.text() );

    if ( $cur.data("operator") === "add" ) {
      number += 1;
    } else {
      number -= 1;
    }

    number = number >= 0 ? number : 0;
    $num.text(number);
    moneyModel.set({ "needPay": this.unitPrice * number });
  },
  renderMoney: function() {
    var moneyText = "￥" + moneyModel.get("needPay");
    this.$el.find(".js-model-money").text(moneyText);
  },
  createOrder: function() {
    var self = this;
    var num = Number( self.$el.find(".js-goods-num").text() );

    if (num <= 0) {
      toast("不能选择0个");
      return;
    }

    hint.showLoading();

    new Promise(function(resolve, reject) {
      appInfo.getUserData(function(err, userData) {
        if (err) {
          reject(err);
        } else {
          resolve(userData);
        }
      });
    }).then(function(userData) {
      var params = _.extend({}, userData.userInfo, {
        imei: userData.deviceInfo.imei,
        p: userData.deviceInfo.p,
        productid: UrlUtil.parseUrlSearch().productid || self.$el.data("productid"),
        num: num
      });

      return new Promise(function(resolve, reject) {
        sendPost("createOrder", params, function(err, data) {
          if (err) {
            reject(err);
          } else {
            resolve(data);
          }
        });
      });
    }).then(function(orderInfo) {
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
          price: moneyModel.get("needPay"),
          orderid: orderInfo.payorderid,
          productdesc: orderInfo.paydesc,
          url: payUrl,
          subdesc: orderInfo.paysubdesc
        };

        return new Promise(function(resolve, reject) {
          NativeAPI.invoke("startPay", payParams, function(err, payData) {
            if (err) {
              reject(err);
            } else {
              resolve(payData);
            }
          });
        });
      } else {
        return null;
      }
    }).then(function() {
      // hint.hideLoading();
      window.location.reload();
    }).catch(function(err) {
      hint.hideLoading();
      toast(err.message, 1500);
    });
  },
  mallCrowdDetail: function() {
    var self = this;

    new Promise(function(resolve, reject) {
      appInfo.getUserData(function(err, userData) {
        if (err) {
          reject(err);
        } else {
          resolve(userData);
        }
      });
    }).then(function(userData) {
      var params = _.extend({}, userData.userInfo, {
        imei: userData.deviceInfo.imei,
        p: userData.deviceInfo.p,
        productid: UrlUtil.parseUrlSearch().productid || self.$el.data("productid")
      });

      return new Promise(function(resolve, reject) {
        sendPost("crowdDetail", params, function(err, data) {
          if (err) {
            reject(err);
          } else {
            resolve(data);
          }
        });
      });
    }).then(function(data) {
      self.unitPrice = data.price;
      self.renderMainPanel(data);
    }).catch(function(err) {
      toast(err.message, 1500);
    });
  },
  renderMainPanel: function(productDetail) {
    var tmpl = require("app/client/mall/tpl/active-page/crowd/main.tpl");
    this.$el.html(tmpl({ data: productDetail }));
    this.$panel = this.$el.find(".js-panel");
    this.$button = this.$el.find(".js-submit");
  }
});

new AppView();
