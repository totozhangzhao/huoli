/*
  首页banner视图
*/
var $         = require("jquery");
var _         = require("lodash");

var mallPromise   = require("app/client/mall/js/lib/mall-promise.js");
var sendPost      = require("app/client/mall/js/lib/mall-request.js").sendPost;

var tplUtil  = require("app/client/mall/js/lib/mall-tpl.js");
var mallUitl = require("app/client/mall/js/lib/util.js");

var toast     = require("com/mobile/widget/hint/hint.js").toast;
var Swipe     = require("com/mobile/lib/swipe/swipe.js");

var BaseView = require("app/client/mall/js/home/views/view.js");

var BannerView = BaseView.extend({

  el: "#home-banner",

  events: {
    "click .js-new-page": "createNewPage"
  },

  template: require("app/client/mall/tpl/home/v2/banner.tpl"),

  initialize: function () {
    // 
    this.fetchData();
  },

  fetchData: function () {
    sendPost("getBanners", null, function(err, result) {
      if (err) {
        toast(err.message, 1500);
        return;
      }

      if (result.length === 0) {
        return;
      }
      this.bannerData = result;
      this.render();
    }.bind(this));
  },

  render: function () {
    this.$el.html(this.template({
      dataList: this.bannerData,
      appName  : mallUitl.getAppName(),
      tplUtil  : tplUtil
    }));

    this.loadSwipe();
    
    return this;
  },

  loadSwipe: function () {
    var $SwipeBox = $(".js-banner-box", this.$el);
    var $index    = $(".js-banner-index", this.$el);
    new Swipe($SwipeBox.get(0), {
      startSlide: 0,
      speed: 400,
      auto: 3000,
      continuous: true,
      disableScroll: false,
      stopPropagation: false,
      callback: function(index) {
        $index
          .removeClass("active")
            .eq(index)
            .addClass("active");
      },
      transitionEnd: function() {}
    });
  }
});

module.exports = BannerView;