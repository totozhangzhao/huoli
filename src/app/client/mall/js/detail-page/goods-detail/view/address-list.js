var $          = require("jquery");
var Backbone   = require("backbone");
var async      = require("async");
var NativeAPI  = require("app/client/common/lib/native/native-api.js");
var toast      = require("com/mobile/widget/hint/hint.js").toast;
var hint       = require("com/mobile/widget/hint/hint.js");
var pageAction = require("app/client/mall/js/lib/page-action.js");
var appInfo    = require("app/client/mall/js/lib/app-info.js");
var UrlUtil    = require("com/mobile/lib/url/url.js");
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
    var self = this;

    if (options.previousView === "") {
      // this.router.switchTo("goods-detail");
      pageAction.setClose();
      // return;
    }

    hint.showLoading();
    
    var addressList = this.collection.addressList;
    var showAddressHelper = function() {
      pageAction.setClose({
        preventDefault: false
      });

      addressUtil.getList(function(err, result) {
        if (err) {
          toast(err.message, 1500);
          return;
        }

        if (addressList) {
          addressList.reset(result);
        } else {
          var AddressList = require("app/client/mall/js/detail-page/goods-detail/collection/address-list.js");
          addressList = new AddressList();
          if (result.length > 0) {
            addressList.add(result);
          }
          self.collection.addressList = addressList;
        }

        self.initView( addressList.toJSON() );
      });
    };

    async.waterfall([
      function(next) {
        appInfo.getUserData(function(err, userData) {
          if (err) {
            toast(err.message, 1500);
            return;
          }

          next(null, userData);
        });
      }
    ], function(err, result) {
      if (result.userInfo.authcode) {
        showAddressHelper();
      } else {
        hint.hideLoading();
        self.loginApp();          
      }
    });
  },
  initView: function(addressList) {
    var addressListTpl = require("app/client/mall/tpl/detail-page/address-list.tpl");

    this.$el.html(addressListTpl({
      addressList: addressList
    }));

    hint.hideLoading();
  },
  loginApp: function() {
    async.waterfall([
      function(next) {

        // window.location.href = "gtgj://?type=gtlogin&bindflag=1&callback=" +
        //   window.btoa(unescape(encodeURIComponent( window.location.href )));

        NativeAPI.invoke("login", null, function(err, data) {
          next(err, data);
        });
      }
    ], function(err, result) {
      if (err) {
        toast(err.message, 1500);
        return;
      }

      if ( String(result.succ) === "1" || result.value === result.SUCC ) {
        window.location.reload();
      } else {
        // hint.hideLoading();
        window.console.log(JSON.stringify(result));
        NativeAPI.invoke("close");
      }
    });
  },
  gotoConfirmPage: function(e) {
    var $cur = $(e.currentTarget);
    this.cache.curAddressId = $cur.closest(".js-item").data("addressid");
    this.router.switchTo("address-confirm");
  },
  setDefaultAddress: function() {
    hint.showLoading();

    var id = this.$el
      .find(".js-default-address:checked")
      .closest(".js-item")
      .data("addressid");

    this.cache.curAddressId = id;

    addressUtil.setDefault(id, function(err) {
      if (err) {
        toast(err.message, 1500);
        return;
      }

      hint.hideLoading();
    });
  },
  addAddress: function() {
    this.cache.addressAction = "add";
    this.router.switchTo("address-add");
  },
  editAddress: function(e) {
    var $cur = $(e.currentTarget);

    this.cache.addressAction = "update";
    this.cache.curAddressId = $cur.closest(".js-item").data("addressid");
    this.router.switchTo("address-add");
  },
  removeAddress: function(e) {
    hint.showLoading();

    var $cur = $(e.currentTarget);
    var $item = $cur.closest(".js-item");
    var addressId = $item.data("addressid");

    addressUtil.remove(addressId, function(err, result) {
      if (err) {
        toast(err.message, 1500);
        return;
      }

      hint.hideLoading();

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
