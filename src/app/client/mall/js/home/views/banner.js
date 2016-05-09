/*
  首页banner视图
*/
var $           = require("jquery");
var Backbone    = require("backbone");
var sendPost    = require("app/client/mall/js/lib/mall-request.js").sendPost;

var tplUtil     = require("app/client/mall/js/lib/mall-tpl.js");
var mallUitl    = require("app/client/mall/js/lib/util.js");

var toast       = require("com/mobile/widget/hint/hint.js").toast;
var Swipe       = require("com/mobile/lib/swipe/swipe.js");

var BannerView = Backbone.View.extend({

  el: "#home-banner",

  template: require("app/client/mall/tpl/home/v2/banner.tpl"),

  initialize: function () {
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
    if(!this.bannerData) {
      this.$el.hide();
      return ;
    }
    this.$el.html(this.template({
      dataList: this.bannerData,
      appName  : mallUitl.getAppName(),
      tplUtil  : tplUtil
    }));

    this.loadSwipe();

    return this;
  },

  loadSwipe: function () {
    var $SwipeBox = $("#banner-box", this.$el);
    var $index    = $("#banner-index>i", this.$el);
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
