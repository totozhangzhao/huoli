/*
  首页banner视图
*/
import $ from "jquery";
import Backbone from "backbone";
import * as tplUtil from "app/client/mall/js/lib/mall-tpl.js";
import * as mallUtil from "app/client/mall/js/lib/util.js";
import Swipe from "com/mobile/lib/swipe/swipe.js";

const BannerView = Backbone.View.extend({

  el: "#home-banner",

  template: require("app/client/mall/tpl/home/v3/banner.tpl"),

  initialize() {
  },


  render(banners) {
    this.$el.html(this.template({
      dataList: banners,
      appName  : mallUtil.getAppName(),
      tplUtil
    }));

    this.loadSwipe();

    return this;
  },

  loadSwipe() {
    const $SwipeBox = $("#banner-box", this.$el);
    const $index    = $("#banner-index>i", this.$el);
    new Swipe($SwipeBox.get(0), {
      startSlide: 0,
      speed: 600,
      auto: 3000,
      continuous: true,
      disableScroll: false,
      stopPropagation: false,
      callback(index) {
        index = Swipe.fixIndex(index, $index.length);
        $index
          .removeClass("active")
            .eq(index)
            .addClass("active");
      },
      transitionEnd() {}
    });
  }
});

export default BannerView;
