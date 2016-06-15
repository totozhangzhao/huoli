import $ from "jquery";
import _ from "lodash";
import Backbone from "backbone";
import {toast} from "com/mobile/widget/hint/hint.js";
import hint from "com/mobile/widget/hint/hint.js";
import ui from "app/client/mall/js/lib/ui.js";
import UrlUtil from "com/mobile/lib/url/url.js";
// import mallUitl from "app/client/mall/js/lib/util.js";
import {sendPost} from "app/client/mall/js/lib/mall-request.js";
// import NativeAPI from "app/client/common/lib/native/native-api.js";
import Promise from "com/mobile/lib/promise/npo.js";
import Tab from "com/mobile/widget/button/tab.js";
import * as widget from "app/client/mall/js/lib/common.js";
import * as mallPromise from "app/client/mall/js/lib/mall-promise.js";
import {initTracker} from "app/client/mall/js/lib/common.js";
import BuyNumModel from "app/client/mall/js/common/models/buy-num-model.js";
import BuyPanelView from "app/client/mall/js/common/views/pay/buy-num-panel.js";
import cookie from "com/mobile/lib/cookie/cookie.js";
import * as loginUtil from "app/client/mall/js/lib/login-util.js";

const detailLog = initTracker("detail");
const AppView = Backbone.View.extend({
  el: "#crowd-detail",
  events: {
    "click .js-webview a"                              : "createNewPage",
    "click .js-rules"                                  : "gotoRulesPage",
    "click .js-fix-text"                               : "hideFixPanel",
    "click .js-tab-wrapper [data-tab-name=goodsDetail]": "renderDetail"
  },

  initialize(commonData) {
    _.extend(this, commonData);
    this.$initial    = ui.initial().show();
    this.buyNumModel = new BuyNumModel();
    this.payView     = new BuyPanelView({
      model: this.buyNumModel,
      buy: () => {this.buy();},
      pay: () => {this.pay();}
    });
    this.urlObj = UrlUtil.parseUrlSearch();
    this.title = "";
    this.urlTitle = this.urlObj.title || this.$el.data("title");
    this.mallCrowdDetail();
  },
  resume() {
    let title = this.urlTitle;
    if (this.title) {
      title = this.title;

      detailLog({
        title: this.title,
        productid: this.urlObj.productid,
        from: this.urlObj.from || "--"
      });
    }

    widget.updateViewTitle(title);
  },
  createNewPage(e) {
    widget.createAView(e);
  },
  hideFixPanel(e) {
    $(e.currentTarget).hide();
  },
  gotoRulesPage() {
    this.router.switchTo("crowd-rules");
  },
  mallCrowdDetail() {
    const render = userData => {
      const params = _.extend({}, userData.userInfo, {
        p: userData.deviceInfo.p,
        productid: this.urlObj.productid
      });

      return new Promise((resolve, reject) => {
        sendPost("crowdDetail", params, (err, data) => {
          if (err) {
            reject(err);
          } else {
            resolve({
              crowd: data,
              userData
            });
          }
        });
      })
        .then(data => {
          const crowd = data.crowd;
          this.renderMainPanel(crowd);
          this.renderBuyNumView(crowd);
          new Tab( this.$el.find(".js-tab-wrapper"), this.$el.find(".js-tab-content") );
          return data.userData;
        })
        .catch(mallPromise.catchFn);
    };
    const start = userData => {
      if (userData.userInfo && userData.userInfo.userid) {
        return render(userData);
      } else {
        return loginUtil.login();
      }
    };

    mallPromise.getAppInfo()
      .then(userData => start(userData))
      .catch(mallPromise.catchFn);
  },
  getMaxLimitNum(total) {
    let maxNum = Math.floor(total * 0.05);

    if (maxNum < 10) {
      maxNum = 10;
    } else if (maxNum > 99) {
      maxNum = 99;
    }

    return maxNum;
  },
  // 加载商品详情
  renderDetail(e) {
    const $cur = $(e.currentTarget);
    if($cur.data("loaded")){
      return;
    }
    hint.showLoading();
    mallPromise.getAppInfo()
      .then(userData => {
        const params = _.extend({}, userData.userInfo, {
          p: userData.deviceInfo.p,
          productid: this.urlObj.productid
        });

        return new Promise((resolve, reject) => {
          sendPost("tplProduct", params, (err, data) => {
            if (err) {
              reject(err);
            } else {
              resolve(data);
            }
          });
        });
      })
      .then(data => {
        $cur.data("loaded", true);
        hint.hideLoading();
        this.$el
          .find("[data-for='goodsDetail']")
            .html(data.tpl);
      })
      .catch(mallPromise.catchFn);
  },
  renderMainPanel(productDetail) {
    let title = this.urlTitle;

    if (productDetail.title) {
      this.title = productDetail.title;
      title = this.title;
      widget.updateViewTitle(title);
    }

    const minBarWidth = 4;
    const maxBarWidth = 100;
    let barWidth = (productDetail.totalcount - productDetail.remaincount) / productDetail.totalcount * 100;

    barWidth = barWidth > minBarWidth ? barWidth : minBarWidth;
    barWidth = barWidth < maxBarWidth ? barWidth : maxBarWidth;

    const isSelling = productDetail.stat === 1 || productDetail.stat === 4;
    const showAnimation = isSelling && (barWidth !== maxBarWidth && barWidth !== minBarWidth);
    const tmpl = require("app/client/mall/tpl/active-page/crowd/main.tpl");

    this.$el.html(tmpl({
      data: productDetail,
      barWidth: showAnimation ? minBarWidth : barWidth
    }));

    const ani = new Promise(resolve => {
      setTimeout(() => {
        this.$initial.hide();
        resolve();
      }, 0);
    });

    if (showAnimation) {
      ani.then(() => {
        setTimeout(() => {
          this.$el
            .find(".js-bar")
              .css("width", `${barWidth}%`);
        }, 0);
      });
    }

    detailLog({
      title,
      productid: this.urlObj.productid,
      from: this.urlObj.from || "--"
    });
  },
  renderBuyNumView(crowd) {
    const buttonText = { "0": "已结束", "1": "立即参与", "2": "已结束", "4": "余量不足" };
    this.buyNumModel.set({
      type:0,
      hasMask: false,
      visible: true,
      title: "购买份数",
      payText:buttonText[crowd.stat],
      payNumText: "去支付",
      price: crowd.price,
      limitNum: Math.min(this.getMaxLimitNum(crowd.totalcount), crowd.remaincount),
      showBuyTip: true,
      canPay: crowd.stat === 1,
      parentDom: "#crowd-detail"
    });
  },

  buy() {
    this.buyNumModel.set({
      hasMask: true,
      type: 1
    });
  },
  pay() {
    const num = this.buyNumModel.get("number");

    if (num <= 0) {
      toast("不能选择0个");
      return;
    }

    hint.showLoading();

    mallPromise
      .order({
        productid: this.urlObj.productid,
        num
      })
      .then(orderInfo => {
        if (orderInfo === void 0) {
          return;
        }
        return this.afterCreateOrder(orderInfo);
      })
      .catch(mallPromise.catchFn);
  },
  afterCreateOrder(orderInfo) {
    let orderDetailUrl = window.location.origin +
      `/fe/app/client/mall/html/detail-page/order-detail.html?orderid=${orderInfo.orderid}`;

    function success() {
      // hint.hideLoading();
      window.location.reload();
    }

    if (String(orderInfo.paystatus) === "0" && orderInfo.payorderid) {
      orderInfo.token = cookie.get("token");
      orderInfo.returnUrl = orderDetailUrl;
      return mallPromise
        .initPay(orderInfo)
        .then(success)
        .catch(mallPromise.catchFn);
    } else {
      return null;
    }
  }
});

module.exports = AppView;
