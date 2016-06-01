import Backbone from "backbone";
import _ from "lodash";
import async from "async";
import appInfo from "app/client/mall/js/lib/app-info.js";
// import NativeAPI from "app/client/common/lib/native/native-api.js";
import {sendPost} from "app/client/mall/js/lib/mall-request.js";
import {toast} from "com/mobile/widget/hint/hint.js";
import hint from "com/mobile/widget/hint/hint.js";
import * as widget from "app/client/mall/js/lib/common.js";
import pageAction from "app/client/mall/js/lib/page-action.js";
import UrlUtil from "com/mobile/lib/url/url.js";
// import mallUitl from "app/client/mall/js/lib/util.js";
import * as mallPromise from "app/client/mall/js/lib/mall-promise.js";
import cookie from "com/mobile/lib/cookie/cookie.js";

const addressListTpl = require("app/client/mall/tpl/detail-page/address-confirm.tpl");
const addressPriceTpl = require("app/client/mall/tpl/detail-page/address-price.tpl");

const AppView = Backbone.View.extend({
  el: "#address-confirm",
  events: {
    "click #confirm-order"        : "confirmOrder",
    "click #address-entry"        : "selectAddress",
    "touchstart [data-operator]"  : "beginTouch",
    "touchend [data-operator]"    : "endTouch",
    "keyup .address-num-input"    : "inputKeyUp",
    "keydown .address-num-input"  : "inputKeyDown",
    "blur .address-num-input"     : "inputBlur"
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
    const model  = this.model.buyNumModel;
    const data = {
      addressInfo,
      goods: this.cache.goods,
      points: model.get("points"),
      ptotal: model.getTotalPoints(),
      money: model.get("price"),
      mtotal: model.getTotalPrice(),
      num: model.get("number")
    };
    this.$el.html(addressListTpl(data));
    this.$el.find(".goods-charge-bar").html(addressPriceTpl(data));
  },
  // 更新number 价格 积分
  refreshNumber() {
    const model  = this.model.buyNumModel;
    const data = {
      addressInfo: this.curAddress,
      goods: this.cache.goods,
      points: model.get("points"),
      ptotal: model.getTotalPoints(),
      money: model.get("price"),
      mtotal: model.getTotalPrice(),
      num: model.get("number")
    };
    this.$el.find(".goods-charge-bar").html(addressPriceTpl(data));
    this.$el.find(".address-num-input").val(model.get("number"));
  },

  selectAddress() {
    this.router.switchTo("address-list");
  },
  confirmOrder() {
    hint.showLoading();
    this.mallCreateOrder(this.cache.goods);
  },
  mallCreateOrder(goods) {
    const self = this;

    async.waterfall([
      next => {
        appInfo.getUserData((err, userData) => {
          if (err) {
            next(err);
            return;
          }

          next(null, userData);
        });
      },
      (userData, next) => {
        const params = _.extend({}, userData.userInfo, {
          p: userData.deviceInfo.p,
          productid: UrlUtil.parseUrlSearch().productid,
          address: self.curAddress,
          num: self.model.buyNumModel.get("number")
        });

        // 一元夺宝特权券
        if (goods.userprivilresp && goods.userprivilresp.privilid) {
          params.privilid = goods.userprivilresp.privilid;
          params.privilprice = goods.userprivilresp.privilprice;
        }

        sendPost("createOrder", params, (err, data) => {
          next(err, data);
        });
      }
    ], (err, result) => {
      if (err) {
        toast(err.message, 1500);
        return;
      }

      self.afterCreateOrder(result, goods);
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
  },

  beginTouch(e) {
    const self = this;
    this.model.buyNumModel.set({
      "refresh": function () {
        self.refreshNumber();
      }
    });
    this.model.payView.beginTouch(e);
  },

  endTouch(e) {
    this.model.payView.endTouch(e);
    this.model.buyNumModel.set({
      "refresh": false
    });
  },

  inputKeyUp(e) {
    this.model.payView.inputKeyUp(e);
  },

  inputKeyDown(e) {
    this.model.payView.inputKeyDown(e);
  },

  inputBlur(e) {
    this.model.payView.inputBlur(e);
  }

});

module.exports = AppView;
