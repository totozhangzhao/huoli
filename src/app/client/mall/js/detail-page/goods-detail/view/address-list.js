var $          = require("jquery");
var _          = require("lodash");
var Backbone   = require("backbone");
var async      = require("async");
var NativeAPI  = require("app/client/common/lib/native/native-api.js");
var toast      = require("com/mobile/widget/hint/hint.js").toast;
var hint       = require("com/mobile/widget/hint/hint.js");
var pageAction = require("app/client/mall/js/lib/page-action.js");
var appInfo    = require("app/client/mall/js/lib/app-info.js");
var UrlUtil    = require("com/mobile/lib/url/url.js");
var sendPost   = require("app/client/mall/js/lib/mall-request.js").sendPost;
var addressUtil = require("app/client/mall/js/lib/address-util.js");
var Popover     = require("com/mobile/widget/popover/popover.js");

require("app/client/mall/js/lib/common.js");

var AppView = Backbone.View.extend({
  el: "#address-list",
  events: {
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

    if (options.previousView === "" && UrlUtil.parseUrlSearch().action === void 0) {
      this.router.switchTo("goods-detail");
      pageAction.setClose();
      return;
    }

    pageAction.hideRightButton();
    hint.showLoading();

    var addressList = this.collection.addressList;

    var showAddressHelper = function() {
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

    var addLeftButtonListener = function() {
      NativeAPI.registerHandler("back", function(params, callback) {
        var $checked = self.$el.find(".js-default-address:checked");
        var isShowConfirm = $checked.length > 0 ? true : false;

        callback(null, {
          preventDefault: isShowConfirm
        });


        if ( isShowConfirm ) {
          var id = $checked.closest(".js-item").data("addressid");

          self.cache.curAddressId = id;
          self.showConfirm();
        }
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

        if (UrlUtil.parseUrlSearch().action === "order") {
          addLeftButtonListener();
        }
      } else {
        hint.hideLoading();
        self.loginApp();
      }
    });
  },
  initView: function(addressList) {
    var addressListTpl = require("app/client/mall/tpl/detail-page/address-list.tpl");

    this.$el
      .find(".js-list-container")
        .html(addressListTpl({
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
  hidePrompt: function() {
    var $el = this.$el;

    $el.find(".js-prompt").hide();
    $el.find(".js-shade").hide();
  },
  handleOrderAction: function() {
    var self = this;
    var addressId = this.cache.curAddressId;

    hint.showLoading();

    async.waterfall([
      function(next) {
        appInfo.getUserData(function(err, userData) {
          if (err) {
            toast(err.message, 1500);
            return;
          }

          next(null, userData);
        });
      },
      function(userData, next) {
        var addressData = self.collection.addressList.get(addressId).toJSON();
        var params = _.extend({}, userData.userInfo, {
          p: userData.deviceInfo.p,
          orderid: UrlUtil.parseUrlSearch().orderid,
          address: addressData
        });

        sendPost("addOrderAddr", params, function(err, data) {
          next(err, data);
        });
      }
    ], function(err) {
      if (err) {
        toast(err.message, 1500);
        return;
      }

      // hint.hideLoading();
      var orderDetailUrl = window.location.origin +
          "/fe/app/client/mall/html/detail-page/order-detail.html" +
          "?orderid=" + UrlUtil.parseUrlSearch().orderid;
      window.location.href = orderDetailUrl;
    });
  },
  gotoConfirmPage: function(e) {
    var self = this;
    var $cur = $(e.currentTarget);
    this.cache.curAddressId = $cur.closest(".js-item").data("addressid");

    if (UrlUtil.parseUrlSearch().action === "order") {
      this.showConfirm();
    } else {
      this.router.switchTo("address-confirm");
    }
  },
  showConfirm: function() {
    var self = this;

    var confirm = new Popover({
      type: "confirm",
      title: "地址提交后不能修改，确定吗？",
      message: "",
      agreeText: "确定",
      cancelText: "修改",
      agreeFunc: function() {
        self.handleOrderAction();
      },
      cancelFunc: function() {}
    });
    confirm.show();
  },
  setDefaultAddress: function() {
    hint.showLoading();

    var id = this.$el
      .find(".js-default-address:checked")
        .closest(".js-item")
        .data("addressid");

    this.cache.curAddressId = id;

    var addressData = this.collection.addressList.get(id).toJSON();

    addressUtil.setDefault(addressData, function(err) {
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
  }
});

module.exports = AppView;
