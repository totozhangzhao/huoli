var $          = require("jquery");
var Backbone   = require("backbone");
var NativeAPI  = require("app/client/common/lib/native/native-api.js");
var toast      = require("com/mobile/widget/toast/toast.js");
var pageAction = require("app/client/mall/js/lib/page-action.js");
var addressUtil = require("app/client/mall/js/lib/address-util.js");

var AppView = Backbone.View.extend({
  el: "#address-list",
  events: {
    // "click #confirm-order": "confirmOrder",
    "click .js-address-info"    : "gotoConfirmPage",
    "change .js-default-address": "setDefaultAddress",
    "click .js-add-address"     : "addAddress",
    "click .js-edit-address"    : "editAddress",
    "click .js-remove-address"  : "removeAddress"
  },
  initialize: function() {
    //
  },
  resume: function(options) {
    if (options.previousView === "") {
      this.router.switchTo("goods-detail");
      pageAction.setClose();
      return;
    }

    pageAction.setClose({
      preventDefault: false
    });

    var self = this;
    var addressList = this.collection.addressList;

    addressUtil.getList(function(err, result) {
      if (err) {
        toast(err.message, 1500);
        return;
      }

      addressList.reset(result);
      self.initView( addressList.toJSON() );
    });
  },
  initView: function(addressList) {
    var addressListTpl = require("app/client/mall/tpl/detail-page/address-list.tpl");

    this.$el.html(addressListTpl({
      addressList: addressList
    }));
  },
  gotoConfirmPage: function(e) {
    var $cur = $(e.currentTarget);
    this.cache.curAddressId = $cur.closest(".js-item").data("addressid");
    this.router.switchTo("address-confirm");
  },
  setDefaultAddress: function() {
    var id = this.$el
      .find(".js-default-address:checked")
      .closest(".js-item")
      .data("addressid");

    addressUtil.setDefault(id, function(err) {
      if (err) {
        toast(err.message, 1500);
        return;
      }
    });
  },
  addAddress: function() {
    this.cache.addressAction = "add";
    this.router.switchTo("address-add");
  },
  editAddress: function(e) {
    var $cur = $(e.currentTarget);
    var $item = $cur.closest(".js-item");
    var addressId = $item.data("addressid");

    this.cache.addressAction = "update";
    this.cache.curAddressId = addressId;
    this.router.switchTo("address-add");
  },
  removeAddress: function(e) {
    var $cur = $(e.currentTarget);
    var $item = $cur.closest(".js-item");
    var addressId = $item.data("addressid");

    addressUtil.remove(addressId, function(err, result) {
      if (err) {
        toast(err.message, 1500);
        return;
      }

      if (result !== void 0) {
        $item.remove();
      }
    });
  },
  updateNativeView: function(title) {
    NativeAPI.invoke("updateTitle", {
      text: title
    });
  }
});

module.exports = AppView;
