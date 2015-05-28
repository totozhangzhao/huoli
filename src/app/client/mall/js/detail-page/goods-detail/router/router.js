var $        = require("jquery");
var Backbone = require("backbone");
var GoodsView = require("app/client/mall/js/detail-page/goods-detail/view/goods-detail.js");
var OrderView = require("app/client/mall/js/detail-page/goods-detail/view/form-phone.js");

var ViewDic = {
  "goods-detail": GoodsView,
  "form-phone"  : OrderView
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
  },
  "default": function() {
    this.switchTo("goods-detail");
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
      bbViews[action].init();
    }
  },
  switchTo: function(panelId) {
    this.navigate("#/" + panelId, {
      trigger: true
    });
  }
});
