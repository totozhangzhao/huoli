var $         = require("jquery");
var Backbone  = require("backbone");
var parseUrl  = require("com/mobile/lib/url/url.js").parseUrlSearch;
var GoodsView = require("app/client/mall/js/detail-page/goods-detail/view/goods-detail.js");
var OrderView = require("app/client/mall/js/detail-page/goods-detail/view/form-phone.js");
var FormCustom = require("app/client/mall/js/detail-page/goods-detail/view/form-custom.js");
var AddAddressView = require("app/client/mall/js/detail-page/goods-detail/view/address-add.js");
var ConfirmAddressView = require("app/client/mall/js/detail-page/goods-detail/view/address-confirm.js");
var AddressListView = require("app/client/mall/js/detail-page/goods-detail/view/address-list.js");

var ViewDic = {
  "goods-detail"   : GoodsView,
  "form-phone"     : OrderView,
  "form-custom"    : FormCustom,
  "address-add"    : AddAddressView,
  "address-confirm": ConfirmAddressView,
  "address-list"   : AddressListView
};

var cache = {};
var model = {};
var collection = {};

module.exports = Backbone.Router.extend({
  routes: {
    "": "default",
    ":action": "dispatch"
  },
  initialize: function() {
    this.bbViews = {};
    this.$panel = $(".bb-panel");
    this.previousView = "";
  },
  "default": function() {
    var view = parseUrl().view;
    
    if (view in ViewDic) {
      this.switchTo(view);
    } else {
      this.switchTo("goods-detail");
    }
  },

  // Dispatch pannels
  dispatch: function(action) {
    this.$panel
      .filter(".active")
        .removeClass("active")
      .end()
        .filter("#" + action)
          .addClass("active");

    var bbViews = this.bbViews;

    if ( !ViewDic[action] ) {
      window.console.log("-- [Backbone View] not found! action: " + action + " --");
      this.switchTo("goods-detail");
      return;
    }

    bbViews[action]        = bbViews[action] || new ViewDic[action]();
    bbViews[action].router = this;
    bbViews[action].cache  = cache;
    bbViews[action].model  = model;
    bbViews[action].collection  = collection;
    bbViews[action].resume({
      previousView: this.previousView
    });
    this.previousView = action;
  },
  switchTo: function(panelId) {
    this.navigate(panelId, {
      trigger: true
    });
  }
});
