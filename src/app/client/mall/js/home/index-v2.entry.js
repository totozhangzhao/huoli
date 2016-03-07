var $             = require("jquery");
var Backbone      = require("backbone");
var _             = require("lodash");
var Promise       = require("com/mobile/lib/promise/npo.js");

var NativeAPI = require("app/client/common/lib/native/native-api.js");
var toast     = require("com/mobile/widget/hint/hint.js").toast;

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

require("com/mobile/widget/button/back-to-top.js");

var AppView = Backbone.View.extend({

  el: "#main",

  events:{
    "click .classify-item[state!=on]": "updateClassify" // 切换频道
  },

  initialize: function () {
    var title = mallUitl.isHangbanFunc() ? "航班商城" : "高铁商城";
    widget.updateViewTitle(title);

    this.$footer        = new Footer();
    this.$bannerView    = new BannerView();
    this.$entranceView  = new EntranceView();
    this.$promotionView = new PromotionView();
    this.$categoryView  = new CategoryView();
    this.$goodsView     = new GoodsView();

  },

  fetchData: function () {
    var self = this;

    mallPromise.appInfo
    .then(function (userData) {
      return new Promise(function(resolve, reject) {
        sendPost("indexPageData", null, function(err, data) {
          if (err) {
            reject(err);
          } else {
            resolve(data);
          }
        });
      });
    })
    .then(function (data) {
      self.render(data);
    })
    .catch(mallPromise.catchFn);

    var data = {
      topmenu: [],
      topgoods: [],
      menu: [],
      goods: []
    };
    // this.render(data);
    this.$bannerView.fetchData();
  },

  render: function (data) {
    this.$entranceView.render(data.topmenu);
    this.$promotionView.render(data.topgoods);
    this.$categoryView.render(data.menu);
    this.$goodsView.render(data.goods);
    this.$footer.render();
    return this;
  },

  // 根据频道获取商品列表
  updateClassify: function (classify) {
    sendPost("classifyGoods", {classify: classify}, function(err, data) {
      if (err) {
        return mallPromise.catchFn(err);
      }
      window.console.log(data);
    });
  },

  loginApp: function() {
    var self = this;
    NativeAPI.invoke("login", null, function (err, data) {
      if (err) {
        toast(err.message, 1500);
        return;
      }

      setTimeout(function() {
        self.mallGetUserInfo({
          rightButtonReady: true
        });
      }, 500);
    });
  }

});

var app = new AppView();
app.fetchData();
