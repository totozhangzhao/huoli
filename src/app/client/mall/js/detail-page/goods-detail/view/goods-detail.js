// var _           = require("lodash");
// var $           = require("jquery");
var Backbone    = require("backbone");
var UrlUtil     = require("com/mobile/lib/url/url.js");
var GoodsNewView = require("app/client/mall/js/detail-page/goods-detail/view/goods-new.js");
var GoodsOldView = require("app/client/mall/js/detail-page/goods-detail/view/goods-old.js");

var AppView = Backbone.View.extend({
  initialize: function(commonData) {
    this.commonData = commonData;
    this.action = UrlUtil.parseUrlSearch().action;
    this.goodsView;
    this.isInit = false;
  },
  resume: function(options) {
    if (!this.isInit) {
      if ( String(this.action) === "9" ) {
        this.goodsView = new GoodsNewView(this.commonData);
      } else {
        this.goodsView = new GoodsOldView(this.commonData);
      }
    }

    this.isInit = true;
    this.goodsView.resume(options);
  }
});

module.exports = AppView;
