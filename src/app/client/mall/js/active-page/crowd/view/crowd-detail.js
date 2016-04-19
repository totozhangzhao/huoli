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
var mallPromise = require("app/client/mall/js/lib/mall-promise.js");
var detailLog   = require("app/client/mall/js/lib/common.js").initTracker("detail");

var BuyNumModel     = require("app/client/mall/js/common/models/buy-num-model.js");
var BuyPanelView = require("app/client/mall/js/common/views/pay/buy-num-panel.js");

var AppView = Backbone.View.extend({
  el: "#crowd-detail",
  events: {
    "click .js-webview a"                              : "createNewPage",
    "click .js-rules"                                  : "gotoRulesPage",
    "click .js-fix-text"                               : "hideFixPanel",
    "click .js-tab-wrapper [data-tab-name=goodsDetail]": "renderDetail"
  },

  initialize: function(commonData) {
    _.extend(this, commonData);

    this.buyNumModel = new BuyNumModel();
    this.payView = new BuyPanelView({
      model: this.buyNumModel,
      buy: function() {this.buy();}.bind(this),
      pay: function() {this.pay();}.bind(this)
    });
    // 活动ID
    this.id = UrlUtil.parseUrlSearch().productid;
    this.title = "";
    this.urlTitle = UrlUtil.parseUrlSearch().title || this.$el.data("title");
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
  createNewPage: function(e) {
    widget.createAView(e);
  },
  hideFixPanel: function(e) {
    $(e.currentTarget).hide();
  },
  gotoRulesPage: function() {
    this.router.switchTo("crowd-rules");

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
          self.renderMainPanel(crowd);
          self.renderBuyNumView(crowd);
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
  },

  renderBuyNumView: function (crowd) {
    var buttonText = { "0": "已结束", "1": "立即参与", "2": "已结束", "4": "余量不足" };
    this.buyNumModel.set({
      type:0,
      hasMask: false,
      visible: true,
      title: "购买份数",
      payText:buttonText[crowd.stat],
      payNumText: "去支付",
      price: crowd.price,
      limitNum: this.getMaxNum(crowd.totalcount),
      showBuyTip: true,
      canPay: crowd.stat === 1,
      parentDom: "#crowd-detail"
    });
  },

  buy: function () {
    this.buyNumModel.set({
      hasMask: true,
      type:1
    });
  },
  pay: function () {
    var self = this;
    var num = this.buyNumModel.get("number");

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
            price: self.buyNumModel.getTotalPrice(),
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
  }
});

module.exports = AppView;
