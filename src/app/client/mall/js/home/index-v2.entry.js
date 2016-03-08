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
var StateModel = Backbone.Model.extend({
  defaults:{
    status: 0 // －1 数据返回失败 0 初始状态 1 请求数据 2 数据返回成功 
  }
});
var AppView = Backbone.View.extend({

  el: "#main",

  events:{
    "click .classify-item[state!=on]": "updateClassify" // 切换频道
  },

  initialize: function () {

    var title = mallUitl.isHangbanFunc() ? "航班商城" : "高铁商城";
    widget.updateViewTitle(title);
    this.stateModel     = new StateModel();
    this.$footer        = new Footer();
    this.$bannerView    = new BannerView();
    this.$entranceView  = new EntranceView();
    this.$promotionView = new PromotionView();
    this.$categoryView  = new CategoryView({model: this.stateModel});
    this.$goodsView     = new GoodsView({model: this.stateModel});

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
  },

  render: function (data) {
    this.$entranceView.render(data.topmenu);
    this.$promotionView.render(data.topgoods);
    this.$categoryView.render(data.menu);
    this.$goodsView.render(data.goods);
    this.$footer.render();
    this.getUserInfo();
    return this;
  },

  getUserInfo: function () {
    mallPromise.appInfo
    .then(function (userData) {
      var params = _.extend({}, userData.userInfo, {
        p: userData.deviceInfo.p
      });
      sendPost("getUserInfo", params, function(err, data) {
        if(err){
          return;
        }
        $("#home-points")
          .find(".num-font").html(data.points)
        .end()
        .show();

      });
    })
    .catch(mallPromise.catchFn);
  }

});

var app = new AppView();
app.fetchData();
