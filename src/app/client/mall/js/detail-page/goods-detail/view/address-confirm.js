import Backbone from "backbone";
import _ from "lodash";
import hint from "com/mobile/widget/hint/hint.js";
import * as widget from "app/client/mall/js/lib/common.js";
import pageAction from "app/client/mall/js/lib/page-action.js";
import * as mallPromise from "app/client/mall/js/lib/mall-promise.js";
import mainViewTpl from "app/client/mall/tpl/detail-page/address-confirm.tpl";
import BaseNumView from "app/client/mall/js/common/views/num-operator/base.js";

import GiftMessageView from "app/client/mall/js/detail-page/goods-detail/view/gift/gift-message-view.js";
const AppView = Backbone.View.extend({

  el: "#address-confirm",

  events: {
    "click #confirm-order"        : "confirmOrder",
    "click #address-entry"        : "selectAddress"
  },

  initialize(commonData) {
    _.extend(this, commonData);
    this.hasNumView = false;
    this.curAddress = null;
    this.giftMessageView = null;
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
    const addressList = this.collection.addressList || [];
    this.curAddress = null;

    if (addressList.length > 0) {
      if (curAddressId) {
        const addrModel = addressList.get(curAddressId);
        if (addrModel) {
          this.curAddress = addrModel.toJSON();
        }
      }
      if (!this.curAddress) {
        this.curAddress = addressList.at(0).toJSON();
      }
    } else {
      // 是微信送礼的情况 不跳转到添加地址页面
      if(this.model.buyNumModel.get("isGift")) {
        //
      } else {
        this.router.replaceTo("address-add");
        return;
      }
    }

    this.initView(this.curAddress);
  },

  initView(addressInfo) {
    const model  = this.model.buyNumModel;
    const data = {
      addressInfo,
      buttonText: this.cache.goods.confirm,
      buyNumModel: model
    };

    _.extend(data, model.toJSON());
    this.$el.html(mainViewTpl(data));

    if(model.get("isGift")) {
      this.giftMessageView = new GiftMessageView({parentDom: "#gift-message-container"});
      this.giftMessageView.render();
    }

    if (!this.hasNumView) {
      this.initNumView();
    }

    model.set({
      _t: Date.now()
    });
  },

  initNumView() {
    const model  = this.model.buyNumModel;
    this.hasNumView = true;
    this.numView = new BaseNumView({
      el: this.el,
      model: model
    });
  },

  selectAddress() {
    this.router.switchTo("address-list");
  },

  confirmOrder() {
    hint.showLoading();
    this.mallCreateOrder(this.cache.goods);
  },

  // 创建订单
  mallCreateOrder(goods) {
    let params = {
      goodspecid: this.model.buyNumModel.get("specValueId"),
      num: this.model.buyNumModel.get("number"),
      productid: this.cache.urlObj.productid,
      address: this.curAddress
    };
    if( this.model.buyNumModel.get("isGift") ) {
      let remark = this.giftMessageView.getGiftMessage().replace(/~~+/ig,'~');
      _.extend(params, {gifttype: 3, remark: encodeURIComponent(remark)});
    }

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
  }
});

export default AppView;
