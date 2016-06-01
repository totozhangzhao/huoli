import Backbone from "backbone";
import _ from "lodash";
// import async from "async";
// import appInfo from "app/client/mall/js/lib/app-info.js";
// import NativeAPI from "app/client/common/lib/native/native-api.js";
// import {sendPost} from "app/client/mall/js/lib/mall-request.js";
// import {toast} from "com/mobile/widget/hint/hint.js";
import hint from "com/mobile/widget/hint/hint.js";
import * as widget from "app/client/mall/js/lib/common.js";
import pageAction from "app/client/mall/js/lib/page-action.js";
// import UrlUtil from "com/mobile/lib/url/url.js";
// import mallUitl from "app/client/mall/js/lib/util.js";
import * as mallPromise from "app/client/mall/js/lib/mall-promise.js";
import cookie from "com/mobile/lib/cookie/cookie.js";

const AppView = Backbone.View.extend({
  el: "#address-confirm",
  events: {
    "click #confirm-order": "confirmOrder",
    "click #address-entry": "selectAddress"
  },
  initialize(commonData) {
    _.extend(this, commonData);
    this.curAddress = {};
  },
  resume(options) {
    if (options.previousView === "") {
      setTimeout(() => {
        this.router.replaceTo("goods-detail");
        pageAction.setClose();
      }, 0);
      return;
    }

    pageAction.hideRightButton();

    if (options.previousView !== "goods-detail") {
      pageAction.setClose();
    }

    const curAddressId = this.cache.curAddressId;
    const addressList = this.collection.addressList;

    if (curAddressId) {
      this.cache.curAddressId = null;
      this.curAddress = addressList.get(curAddressId).toJSON();
    } else if (addressList.length > 0) {
      this.curAddress = addressList.at(0).toJSON();
    }

    this.initView(this.curAddress);
  },
  initView(addressInfo) {
    const addressListTpl = require("app/client/mall/tpl/detail-page/address-confirm.tpl");
    const model  = this.model.buyNumModel;
    this.$el.html(addressListTpl({
      addressInfo,
      goods: this.cache.goods,
      points: model.get("points"),
      ptotal: model.getTotalPoints(),
      money: model.get("price"),
      mtotal: model.getTotalPrice(),
      num: model.get("number")
    }));
  },
  selectAddress() {
    this.router.switchTo("address-list");
  },
  confirmOrder() {
    hint.showLoading();
    this.mallCreateOrder(this.cache.goods);
  },
  mallCreateOrder(goods) {
    let params = {
      openid: this.cache.urlObj.openid,
      address: this.curAddress,
      num: this.model.buyNumModel.get("number"),
      productid: this.cache.urlObj.productid
    };

    // 一元夺宝特权券
    if (goods.userprivilresp && goods.userprivilresp.privilid) {
      params.privilid = goods.userprivilresp.privilid;
      params.privilprice = goods.userprivilresp.privilprice;
    }

    mallPromise
      .order(params)
      .then(orderInfo => {
        if (orderInfo === void 0) {
          return;
        }
        return this.afterCreateOrder(orderInfo);
      })
      .catch(err => {
        hint.hideLoading();
        mallPromise.catchFn(err);
      });
  },
  afterCreateOrder(orderInfo) {
    let orderDetailUrl = window.location.origin +
      `/fe/app/client/mall/html/detail-page/order-detail.html?orderid=${orderInfo.orderid}`;

    function success() {
      widget.createNewView({
        url: orderDetailUrl
      });
      hint.hideLoading();
    }

    if (String(orderInfo.paystatus) === "0" && orderInfo.payorderid) {
      orderInfo.token = cookie.get("token");
      orderInfo.returnUrl = orderDetailUrl;
      return mallPromise
        .initPay(orderInfo)
        .then(success)
        .catch(mallPromise.catchFn);
    } else {
      return success();
    }
  }
});

module.exports = AppView;
