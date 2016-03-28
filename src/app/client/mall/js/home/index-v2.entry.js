var $             = require("jquery");
var Backbone      = require("backbone");
var _             = require("lodash");
var Promise       = require("com/mobile/lib/promise/npo.js");

var NativeAPI     = require("app/client/common/lib/native/native-api.js");
var toast         = require("com/mobile/widget/hint/hint.js").toast;

var mallPromise   = require("app/client/mall/js/lib/mall-promise.js");
var sendPost      = require("app/client/mall/js/lib/mall-request.js").sendPost;
var Util          = require("com/mobile/lib/util/util.js");
var mallUitl      = require("app/client/mall/js/lib/util.js");
var UrlUtil       = require("com/mobile/lib/url/url.js");
var ui            = require("app/client/mall/js/lib/ui.js");

var widget        = require("app/client/mall/js/lib/common.js");
var imgDelay      = require("app/client/mall/js/lib/common.js").imageDelay;

var logger        = require("com/mobile/lib/log/log.js");

// models
var StateModel = require("app/client/mall/common/models/state.js");
// views
var BannerView    = require("app/client/mall/js/home/views/banner.js");
var EntranceView  = require("app/client/mall/js/home/views/entrance.js");
var PromotionView = require("app/client/mall/js/home/views/promotion.js");
var CategoryView  = require("app/client/mall/js/home/views/category.js");
var GoodsView     = require("app/client/mall/common/views/index-goods.js");
var Footer        = require("app/client/mall/common/views/footer.js");
var PointsView    = require("app/client/mall/js/home/views/points.js");
require("com/mobile/widget/button/back-to-top.js");

var AppView = Backbone.View.extend({

  el: "#main",

  events:{
    "click .classify-item[state!=on]": "updateClassify" // 切换频道
  },

  initialize: function () {

    var title = mallUitl.isHangbanFunc() ? "航班商城" : "高铁商城";
    widget.updateViewTitle(title);
    this.$initial       = ui.initial().show();
    this.stateModel     = new StateModel();
    this.$footer        = new Footer();
    this.$bannerView    = new BannerView();
    this.$entranceView  = new EntranceView();
    this.$promotionView = new PromotionView();
    this.$categoryView  = new CategoryView({model: this.stateModel});
    this.$goodsView     = new GoodsView({model: this.stateModel, showLoading: true});
    this.$pointsView    = new PointsView();
    this.listenTo(this.stateModel, "change:status", this.stateChange);
    logger.track(mallUitl.getAppName() + "PV", "View PV", title);
    this.bindEvents();
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
    var self = this;
    this.$entranceView.render(data.topmenu || []);
    this.$promotionView.render(data.topgoods || []);
    this.$categoryView.render(data.menu || []);
    this.$goodsView.render(data.goods || []);
    this.$footer.render();
    // this.initWarning();
    this.getUserInfo();
    setTimeout(function() {
      self.$initial.hide();
    }, 600);
    return this;
  },

  initWarning: function() {
    var $warning = require("app/client/mall/js/lib/warning.js").init("顶部提示信息");
    $warning.insertBefore("#home-banner");
  },

  getUserInfo: function () {
    var self = this;
    mallPromise.appInfo
    .then(function (userData) {
      var params = _.extend({}, userData.userInfo, {
        p: userData.deviceInfo.p
      });
      sendPost("getUserInfo", params, function(err, data) {
        if(err){
          return;
        }
        self.$pointsView.render(data);
        self.showCheckinBtn();
      });
    })
    .catch(mallPromise.catchFn);
  },

  // 显示签到按钮
  showCheckinBtn: function () {
    if ( !mallUitl.isHangbanFunc() ) {
      NativeAPI.invoke("updateHeaderRightBtn", {
        action: "show",
        text: "签到"
      }, function(err) {
        if (err) {
          toast(err.message, 1500);
          return;
        }
      });

      NativeAPI.registerHandler("headerRightBtnClick", function() {
        widget.createNewView({
          url: "https://jt.rsscc.com/gtgjwap/act/20150925/index.html"
        });
        logger.track(mallUitl.getAppName() + "-签到", "click");
      });
    }
  },

  stateChange: function (e) {
    if(e.get("status") !== 1){
      $(window).scrollTop(this.getFixTop() + 18);
    }
  },

  bindEvents: function () {
    $(window).scroll(function(event) {
      var height = this.getFixTop();
      if($(window).scrollTop() > height){
        this.$categoryView.fix();
      }else{
        this.$categoryView.rel();
      }
    }.bind(this));
  },

  // 获取分类选择吸顶效果的top距离
  getFixTop: function () {
    return this.$goodsView.$el.get(0).offsetTop - this.$categoryView.$el.get(0).offsetHeight;
  }

});

var app = new AppView();
app.fetchData();
