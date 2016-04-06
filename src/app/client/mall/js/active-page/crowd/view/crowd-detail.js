var $         = require("jquery");
var _         = require("lodash");
var Backbone  = require("backbone");
var toast     = require("com/mobile/widget/hint/hint.js").toast;
var hint      = require("com/mobile/widget/hint/hint.js");
var UrlUtil   = require("com/mobile/lib/url/url.js");
var mallUitl  = require("app/client/mall/js/lib/util.js");
var sendPost  = require("app/client/mall/js/lib/mall-request.js").sendPost;
var NativeAPI = require("app/client/common/lib/native/native-api.js");
var Promise   = require("com/mobile/lib/promise/npo.js");
var Tab       = require("com/mobile/widget/button/tab.js");
var widget    = require("app/client/mall/js/lib/common.js");
var moneyModel  = require("app/client/mall/js/active-page/crowd/model/money.js").money;
var mallPromise = require("app/client/mall/js/lib/mall-promise.js");
var detailLog   = require("app/client/mall/js/lib/common.js").initTracker("detail");

var AppView = Backbone.View.extend({
  el: "#crowd-detail",
  events: {
    "click .js-pop-shadow"                             : "hidePurchasePanel",
    "click .js-hide-panel"                             : "hidePurchasePanel",
    "touchstart .js-change-num"                        : "combo",
    "touchend .js-change-num"                          : "setNum",
    "click .js-rules"                                  : "gotoRulesPage",
    "click .js-fix-text"                               : "hideFixPanel",
    "click .js-submit"                                 : "submitButtonEvent",
    "click .js-tab-wrapper [data-tab-name=goodsDetail]": "renderDetail",
    "keyup .js-goods-num"                              : "inputKeyUp",
    "keydown .js-goods-num"                            : "inputKeyDown",
    "blur .js-goods-num"                               : "inputBlur"
  },
  initialize: function() {

    // 活动ID
    this.id = UrlUtil.parseUrlSearch().productid;

    // 单价
    this.unitPrice = 0;

    // 单笔订单数量上限
    this.maxNum = null;

    // 剩余数量
    this.remainNum = 0;

    this.comboMode = false;
    this.comboFuncTimer = null;
    this.title = "";
    this.urlTitle = UrlUtil.parseUrlSearch().title || this.$el.data("title");
    this.$popShadow;
    this.$popPanel;
    this.$goodsNum;
    this.$button;
    this.listenTo(moneyModel, "change", this.renderMoney);
    this.mallCrowdDetail();
  },
  resume: function() {
    var title = this.urlTitle;

    if (this.title) {
      title = this.title;

      detailLog({
        title: this.title,
        productid: UrlUtil.parseUrlSearch().productid,
        from: UrlUtil.parseUrlSearch().from || "--"
      });
    }

    widget.updateViewTitle(title);
  },
  hideFixPanel: function(e) {
    $(e.currentTarget).hide();
  },
  gotoRulesPage: function() {
    this.router.switchTo("crowd-rules");
  },
  submitButtonEvent: function() {
    if ( this.$popShadow.is(":visible") ) {
      this.createOrder();
    } else {
      this.showPurchasePanel();
    }
  },
  showPurchasePanel: function() {
    var price = this.unitPrice * Number( this.$goodsNum.val() );
    moneyModel.set({
      "needPay": price
    }, {
      silent: true
    });
    this.$popShadow.show();
    this.$button.text( this.$button.data("payText") );
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
    var maxNum = this.maxNum;
    var minNum = 1;
    var remainNum = this.remainNum;

    if ( number > maxNum ) {
      number = maxNum;
      toast("已到单笔订单数量上限", 1500);
    } else if ( number < minNum ) {
      number = minNum;
    } else if ( remainNum >= minNum && remainNum <= maxNum && number > remainNum ) {
      number = remainNum;
      toast("剩余数量不足", 1500);
    }

    this.$goodsNum.val(number);
    moneyModel.set({
      needPay: this.unitPrice * number,
      _t: Date.now()
    });
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
  renderMoney: function() {
    var moneyText = "￥" + moneyModel.get("needPay");
    this.$el.find(".js-model-money").text(moneyText);
  },
  createOrder: function() {
    var self = this;
    var num = Number( self.$el.find(".js-goods-num").val() );

    if (num <= 0) {
      toast("不能选择0个");
      return;
    }

    hint.showLoading();

    mallPromise.getAppInfo()
      .then(function(userData) {
        var params = _.extend({}, userData.userInfo, {
          p: userData.deviceInfo.p,
          productid: self.id,
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
      })
      .then(function(orderInfo) {
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
      })
      .then(function() {
        // hint.hideLoading();
        window.location.reload();
      })
      .catch(mallPromise.catchFn);
  },
  mallCrowdDetail: function() {
    var self = this;
    var render = function(userData) {
      var params = _.extend({}, userData.userInfo, {
        p: userData.deviceInfo.p,
        productid: self.id
      });

      return new Promise(function(resolve, reject) {
        sendPost("crowdDetail", params, function(err, data) {
          if (err) {
            reject(err);
          } else {
            resolve({
              crowd: data,
              userData: userData
            });
          }
        });
      })
        .then(function(data) {
          var crowd = data.crowd;
          self.unitPrice = Number(crowd.price);
          self.remainNum = Number(crowd.remaincount);
          self.maxNum = self.getMaxNum(crowd.totalcount);
          self.renderMainPanel(crowd);
          new Tab( self.$el.find(".js-tab-wrapper"), self.$el.find(".js-tab-content") );
          return data.userData;
        })
        .catch(mallPromise.catchFn);
    };
    var start = function(userData) {
      if (userData.userInfo && userData.userInfo.userid) {
        return render(userData);
      } else {
        return self.loginApp();
      }
    };

    mallPromise.getAppInfo()
      .then(function(userData) {
        return start(userData);
      })
      .catch(mallPromise.catchFn);
  },
  getMaxNum: function(total) {
    var maxNum = Math.floor(total * 0.05);

    if (maxNum < 10) {
      maxNum = 10;
    } else if (maxNum > 99) {
      maxNum = 99;
    }

    return maxNum;
  },
  // 加载商品详情
  renderDetail: function (e) {
    var $cur = $(e.currentTarget);
    if($cur.data("loaded")){
      return;
    }
    hint.showLoading();
    var self = this;
    mallPromise.getAppInfo()
      .then(function(userData) {
        var params = _.extend({}, userData.userInfo, {
          p: userData.deviceInfo.p,
          productid: self.id
        });

        return new Promise(function(resolve, reject) {
          sendPost("tplProduct", params, function(err, data) {
            if (err) {
              reject(err);
            } else {
              resolve(data);
            }
          });
        });
      })
      .then(function(data) {
        $cur.data("loaded", true);
        hint.hideLoading();
        self.$el
          .find("[data-for='goodsDetail']")
            .html(data.tpl);
      })
      .catch(mallPromise.catchFn);
  },
  renderMainPanel: function(productDetail) {
    var self = this;
    var title = this.urlTitle;

    if (productDetail.title) {
      this.title = productDetail.title;
      title = this.title;
      widget.updateViewTitle(title);
    }

    var minBarWidth = 4;
    var maxBarWidth = 100;
    var barWidth = (productDetail.totalcount - productDetail.remaincount) / productDetail.totalcount * 100;

    barWidth = barWidth > minBarWidth ? barWidth : minBarWidth;
    barWidth = barWidth < maxBarWidth ? barWidth : maxBarWidth;

    var isSelling = productDetail.stat === 1 || productDetail.stat === 4;
    var showAnimation = isSelling && (barWidth !== maxBarWidth && barWidth !== minBarWidth);
    var tmpl = require("app/client/mall/tpl/active-page/crowd/main.tpl");

    this.$el.html(tmpl({
      data: productDetail,
      barWidth: showAnimation ? minBarWidth : barWidth
    }));
    this.$popShadow = this.$el.find(".js-pop-shadow");
    this.$popPanel = this.$el.find(".js-pop-panel");
    this.$goodsNum = this.$el.find(".js-goods-num");
    this.$button = this.$el.find(".js-submit");

    if (showAnimation) {
      _.defer(function() {
        self.$el
          .find(".js-bar")
            .css("width", barWidth + "%");
      }, 300);
    }

    detailLog({
      title: title,
      productid: UrlUtil.parseUrlSearch().productid,
      from: UrlUtil.parseUrlSearch().from || "--"
    });
  },
  loginApp: function() {
    return new Promise(function(resolve, reject) {
      NativeAPI.invoke("login", null, function(err, data) {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    })
      .then(function(result) {
        if ( String(result.succ) === "1" || result.value === result.SUCC ) {
          window.location.reload();
        } else {
          // hint.hideLoading();
          window.console.log(JSON.stringify(result));
          NativeAPI.invoke("close");
        }
      })
      .catch(mallPromise.catchFn);
  }
});

module.exports = AppView;
