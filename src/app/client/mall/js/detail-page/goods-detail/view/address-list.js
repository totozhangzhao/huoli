import $ from "jquery";
import _ from "lodash";
import Backbone from "backbone";
import NativeAPI from "app/client/common/lib/native/native-api.js";
import hint from "com/mobile/widget/hint/hint.js";
import pageAction from "app/client/mall/js/lib/page-action.js";
import UrlUtil from "com/mobile/lib/url/url.js";
import {sendPost} from "app/client/mall/js/lib/mall-request.js";
import * as addressUtil from "app/client/mall/js/lib/address-util.js";
import Popover from "com/mobile/widget/popover/popover.js";
import * as widget from "app/client/mall/js/lib/common.js";
import {initTracker} from "app/client/mall/js/lib/common.js";
import AddressList from "app/client/mall/js/detail-page/goods-detail/collection/address-list.js";
import * as mallPromise from "app/client/mall/js/lib/mall-promise.js";

const detailLog = initTracker("address");

let AppView = Backbone.View.extend({
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
    let self = this;

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

    let showAddressHelper = () => {
      addressUtil.getList(result => {
        if (addressList) {
          addressList.reset(result);
        } else {
          addressList = new AddressList();
          if (result.length > 0) {
            addressList.add(result);
          }
          self.collection.addressList = addressList;
        }

        self.initView( addressList.toJSON() );
      });
    };

    let addLeftButtonListener = () => {
      NativeAPI.registerHandler("back", (params, callback) => {
        let $checked = self.$el.find(".js-default-address:checked");
        let isShowConfirm = $checked.length > 0 ? true : false;

        callback(null, {
          preventDefault: isShowConfirm
        });


        if ( isShowConfirm ) {
          let id = $checked.closest(".js-item").data("addressid");

          self.cache.curAddressId = id;
          self.showConfirm();
        }
      });
    };

    mallPromise
      .checkLogin()
      .then(() => {
        showAddressHelper();
        if (this.urlObj.mold === "order") {
          addLeftButtonListener();
        }
      })
      .catch(mallPromise.catchFn);

    detailLog({
      title,
      hlfrom: this.urlObj.hlfrom || "--"
    });
  },
  initView(addressList) {
    let addressListTpl = require("app/client/mall/tpl/detail-page/address-list.tpl");

    this.$el
      .find(".js-list-container")
        .html(addressListTpl({
          addressList
        }));

    hint.hideLoading();
  },
  hidePrompt() {
    let $el = this.$el;

    $el.find(".js-prompt").hide();
    $el.find(".js-shade").hide();
  },
  handleOrderAction() {
    let addressId = this.cache.curAddressId;
    hint.showLoading();

    mallPromise
      .getAppInfo()
      .then(userData => {
        let addressData = this.collection.addressList.get(addressId).toJSON();
        let params = _.extend({}, userData.userInfo, {
          p: userData.deviceInfo.p,
          orderid: UrlUtil.parseUrlSearch().orderid,
          address: addressData
        });
        return new Promise((resolve, reject) => {
          sendPost("addOrderAddr", params, (err, data) => {
            if (err) {
              reject(err);
            } else {
              resolve(data);
            }
          });
        });
      })
      .then(() => {
        // hint.hideLoading();
        let orderDetailUrl = `/fe/app/client/mall/html/detail-page/order-detail.html?orderid=${UrlUtil.parseUrlSearch().orderid}`;
        window.location.href = orderDetailUrl;
      })
      .catch(mallPromise.catchFn);
  },
  gotoConfirmPage(e) {
    let $cur = $(e.currentTarget);

    this.cache.curAddressId = $cur.closest(".js-item").data("addressid");

    if (this.urlObj.mold === "order") {
      this.showConfirm();
    } else if (this.urlObj.mold === void 0) {
      this.router.replaceTo("address-confirm");
    }
  },
  showConfirm() {
    let self = this;

    let confirm = new Popover({
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

    let id = this.$el
      .find(".js-default-address:checked")
        .closest(".js-item")
        .data("addressid");

    let addressData = this.collection.addressList.get(id).toJSON();

    addressUtil.setDefault(addressData, () => {
      hint.hideLoading();
    });
  },
  addAddress() {
    this.cache.addressAction = "add";
    this.router.replaceTo("address-add");
  },
  editAddress(e) {
    let $cur = $(e.currentTarget);

    this.cache.addressAction = "update";
    this.cache.curAddressId = $cur.closest(".js-item").data("addressid");
    this.router.replaceTo("address-add");
  },
  removeAddress(e) {
    const self = this;

    function doRemove() {
      hint.showLoading();

      let $cur = $(e.currentTarget);
      let $item = $cur.closest(".js-item");
      let addressId = $item.data("addressid");

      addressUtil.remove(addressId, result => {
        hint.hideLoading();

        if (result !== void 0) {
          self.collection.addressList.remove(addressId);
          $item.remove();
        }
      });
    }

    let confirm = new Popover({
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
