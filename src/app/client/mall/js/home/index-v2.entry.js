var $             = require("jquery");
var Backbone      = require("backbone");
var _             = require("lodash");
var Promise       = require("com/mobile/lib/promise/npo.js");

var mallPromise   = require("app/client/mall/js/lib/mall-promise.js");
var sendPost      = require("app/client/mall/js/lib/mall-request.js").sendPost;
var Util          = require("com/mobile/lib/util/util.js");
var mallUitl      = require("app/client/mall/js/lib/util.js");
var UrlUtil       = require("com/mobile/lib/url/url.js");


var widget        = require("app/client/mall/js/lib/common.js");
var imgDelay      = require("app/client/mall/js/lib/common.js").imageDelay;

// models

// collections

// views
var BannerView    = require("app/client/mall/js/home/views/banner.js");
var EntranceView  = require("app/client/mall/js/home/views/entrance.js");
var PromotionView = require("app/client/mall/js/home/views/promotion.js");
var CategoryView  = require("app/client/mall/js/home/views/category.js");
var GoodsView     = require("app/client/mall/js/home/views/goods.js");
var Footer        = require("app/client/mall/common/views/footer.js");

var AppView = Backbone.View.extend({

  el: "#main",

  events:{},

  initialize: function () {
    this.$footer        = new Footer();
    this.$bannerView    = new BannerView();
    this.$entranceView  = new EntranceView();
    this.$promotionView = new PromotionView();
    this.$categoryView  = new CategoryView();
    this.$goodsView     = new GoodsView();
  },

  fetchData: function () {
    this.$bannerView.fetchData();
    this.render();
  },

  render: function () {
    this.$entranceView.render();
    this.$promotionView.render();
    this.$categoryView.render();
    this.$goodsView.render();
    this.$footer.render();
    return this;
  }
});

var app = new AppView();
app.fetchData();
