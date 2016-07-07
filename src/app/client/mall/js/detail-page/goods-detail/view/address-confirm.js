import Backbone from "backbone";
import _ from "lodash";
import hint from "com/mobile/widget/hint/hint.js";
import * as widget from "app/client/mall/js/lib/common.js";
import pageAction from "app/client/mall/js/lib/page-action.js";
import * as mallPromise from "app/client/mall/js/lib/mall-promise.js";
import addressListTpl from "app/client/mall/tpl/detail-page/address-confirm.tpl";
import addressPriceTpl from "app/client/mall/tpl/detail-page/address-price.tpl";

const AppView = Backbone.View.extend({
  el: "#address-confirm",
  events: {
    "click #confirm-order"        : "confirmOrder",
    "click #address-entry"        : "selectAddress",
    "touchstart [data-operator]"  : "beginTouch",
    "touchend [data-operator]"    : "endTouch",
    "keyup .address-num-input"    : "inputKeyUp",
    "keydown .address-num-input"  : "inputKeyDown",
    "blur .address-num-input"     : "inputBlur",
    "focus .address-num-input"    : "inputFocus"
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
    let params = {
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
      hint.hideLoading();
      widget.createNewView({
        url: orderDetailUrl
      });
    }

    if (String(orderInfo.paystatus) === "0" && orderInfo.payorderid) {
      orderInfo.returnUrl = orderDetailUrl;
      return mallPromise
        .initPay(orderInfo)
        .then(success);
    } else {
      return success();
    }
  },

  beginTouch(e) {
    this.canRefresh(true);
    this.model.payView.beginTouch(e);
  },

  endTouch(e) {
    this.model.payView.endTouch(e);
    this.canRefresh(false);
  },

  inputFocus() {
    this.canRefresh(true);
  },

  inputKeyUp(e) {
    this.model.payView.inputKeyUp(e);
  },

  inputKeyDown(e) {
    this.model.payView.inputKeyDown(e);
  },

  inputBlur(e) {
    this.model.payView.inputBlur(e);
    this.canRefresh(false);
  },

  canRefresh(flag) {
    const self = this;
    if(flag){
      this.model.buyNumModel.set({
        "refresh": function () {
          self.refreshNumber();
        }
      });
    }else{
      this.model.buyNumModel.set({
        "refresh": false
      });
    }
  }

});

export default AppView;
