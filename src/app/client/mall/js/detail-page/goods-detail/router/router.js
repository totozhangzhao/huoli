var $         = require("jquery");
var Backbone  = require("backbone");
var parseUrl  = require("com/mobile/lib/url/url.js").parseUrlSearch;
var GoodsView = require("app/client/mall/js/detail-page/goods-detail/view/goods-detail.js");
var OrderView = require("app/client/mall/js/detail-page/goods-detail/view/form-phone.js");
var interlayerView = require("app/client/mall/js/detail-page/goods-detail/view/interlayer.js");

var ViewDic = {
  "goods-detail": GoodsView,
  "form-phone"  : OrderView,
  "interlayer"  : interlayerView
};

var cache = {};

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
    if ( parseUrl().productid.length === 8 ) {
      this.switchTo("interlayer");
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
    var CurView = ViewDic[action];

    if (CurView) {
      bbViews[action]        = bbViews[action] || new ViewDic[action]();
      bbViews[action].router = this;
      bbViews[action].cache  = cache;
      bbViews[action].init({
        previousView: this.previousView
      });
      this.previousView = action;
    }
  },
  switchTo: function(panelId) {
    this.navigate("#/" + panelId, {
      trigger: true
    });
  }
});
