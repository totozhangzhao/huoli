import $ from "jquery";
import _ from "lodash";
import Backbone from "backbone";
import async from "async";
import NativeAPI from "app/client/common/lib/native/native-api.js";
import {toast} from "com/mobile/widget/hint/hint.js";
import hint from "com/mobile/widget/hint/hint.js";
import pageAction from "app/client/mall/js/lib/page-action.js";
import appInfo from "app/client/mall/js/lib/app-info.js";
import UrlUtil from "com/mobile/lib/url/url.js";
import {sendPost} from "app/client/mall/js/lib/mall-request.js";
import * as addressUtil from "app/client/mall/js/lib/address-util.js";
import Popover from "com/mobile/widget/popover/popover.js";
import * as widget from "app/client/mall/js/lib/common.js";
import * as loginUtil from "app/client/mall/js/lib/login-util.js";
import {initTracker} from "app/client/mall/js/lib/common.js";

const detailLog = initTracker("address");

const AppView = Backbone.View.extend({
  el: "#address-list",
  events: {
    "click .js-address-info"    : "gotoConfirmPage",
    "change .js-default-address": "setDefaultAddress",
    "click .js-add-address"     : "addAddress",
    "click .js-edit-address"    : "editAddress",
    "click .js-remove-address"  : "removeAddress"
  },
  initialize(commonData) {
    _.extend(this, commonData);
  },
  resume(options) {
    const self = this;

    this.urlObj = UrlUtil.parseUrlSearch();

    if (options.previousView === "" && this.urlObj.mold === void 0) {
      setTimeout(() => {
        this.router.replaceTo("goods-detail");
        pageAction.setClose();
      }, 0);
      return;
    }

    let title = "地址管理";

    widget.updateViewTitle(title);
    pageAction.hideRightButton();
    hint.showLoading();

    let addressList = this.collection.addressList;

    const showAddressHelper = () => {
      addressUtil.getList((err, result) => {
        if (err) {
          toast(err.message, 1500);
          return;
        }

        if (addressList) {
          addressList.reset(result);
        } else {
          const AddressList = require("app/client/mall/js/detail-page/goods-detail/collection/address-list.js");
          addressList = new AddressList();
          if (result.length > 0) {
            addressList.add(result);
          }
          self.collection.addressList = addressList;
        }

        self.initView( addressList.toJSON() );
      });
    };

    const addLeftButtonListener = () => {
      NativeAPI.registerHandler("back", (params, callback) => {
        const $checked = self.$el.find(".js-default-address:checked");
        const isShowConfirm = $checked.length > 0 ? true : false;

        callback(null, {
          preventDefault: isShowConfirm
        });


        if ( isShowConfirm ) {
          const id = $checked.closest(".js-item").data("addressid");

          self.cache.curAddressId = id;
          self.showConfirm();
        }
      });
    };

    async.waterfall([
      next => {
        appInfo.getUserData((err, userData) => {
          if (err) {
            toast(err.message, 1500);
            return;
          }

          next(null, userData);
        });
      }
    ], (err, result) => {
      if (result.userInfo.authcode) {
        showAddressHelper();

        if (self.urlObj.mold === "order") {
          addLeftButtonListener();
        }
      } else {
        hint.hideLoading();
        loginUtil.login();
      }
    });

    detailLog({
      title,
      from: this.urlObj.from || "--"
    });
  },
  initView(addressList) {
    const addressListTpl = require("app/client/mall/tpl/detail-page/address-list.tpl");

    this.$el
      .find(".js-list-container")
        .html(addressListTpl({
          addressList
        }));

    hint.hideLoading();
  },
  hidePrompt() {
    const $el = this.$el;

    $el.find(".js-prompt").hide();
    $el.find(".js-shade").hide();
  },
  handleOrderAction() {
    const self = this;
    const addressId = this.cache.curAddressId;

    hint.showLoading();

    async.waterfall([
      next => {
        appInfo.getUserData((err, userData) => {
          if (err) {
            toast(err.message, 1500);
            return;
          }

          next(null, userData);
        });
      },
      (userData, next) => {
        const addressData = self.collection.addressList.get(addressId).toJSON();
        const params = _.extend({}, userData.userInfo, {
          p: userData.deviceInfo.p,
          orderid: UrlUtil.parseUrlSearch().orderid,
          address: addressData
        });

        sendPost("addOrderAddr", params, (err, data) => {
          next(err, data);
        });
      }
    ], err => {
      if (err) {
        toast(err.message, 1500);
        return;
      }

      // hint.hideLoading();
      const orderDetailUrl = `${window.location.origin}/fe/app/client/mall/html/detail-page/order-detail.html?orderid=${UrlUtil.parseUrlSearch().orderid}`;
      window.location.href = orderDetailUrl;
    });
  },
  gotoConfirmPage(e) {
    const $cur = $(e.currentTarget);

    this.cache.curAddressId = $cur.closest(".js-item").data("addressid");

    if (this.urlObj.mold === "order") {
      this.showConfirm();
    } else if (this.urlObj.mold === void 0) {
      this.router.replaceTo("address-confirm");
    }
  },
  showConfirm() {
    const self = this;

    const confirm = new Popover({
      type: "confirm",
      title: "地址提交后不能修改，确定吗？",
      message: "",
      agreeText: "确定",
      cancelText: "修改",
      agreeFunc() {
        self.handleOrderAction();
      },
      cancelFunc() {}
    });
    confirm.show();
  },
  setDefaultAddress() {
    hint.showLoading();

    const id = this.$el
      .find(".js-default-address:checked")
        .closest(".js-item")
        .data("addressid");

    this.cache.curAddressId = id;

    const addressData = this.collection.addressList.get(id).toJSON();

    addressUtil.setDefault(addressData, err => {
      if (err) {
        toast(err.message, 1500);
        return;
      }

      hint.hideLoading();
    });
  },
  addAddress() {
    this.cache.addressAction = "add";
    this.router.replaceTo("address-add");
  },
  editAddress(e) {
    const $cur = $(e.currentTarget);

    this.cache.addressAction = "update";
    this.cache.curAddressId = $cur.closest(".js-item").data("addressid");
    this.router.replaceTo("address-add");
  },
  removeAddress(e) {
    const doRemove = () => {
      hint.showLoading();

      const $cur = $(e.currentTarget);
      const $item = $cur.closest(".js-item");
      const addressId = $item.data("addressid");

      addressUtil.remove(addressId, (err, result) => {
        if (err) {
          toast(err.message, 1500);
          return;
        }

        hint.hideLoading();

        if (result !== void 0) {
          $item.remove();
        }
      });
    };

    const confirm = new Popover({
      type: "confirm",
      title: "确定删除此地址吗？",
      message: "",
      agreeText: "确定",
      cancelText: "取消",
      agreeFunc() {
        doRemove();
      },
      cancelFunc() {}
    });
    confirm.show();
  }
});

export default AppView;
