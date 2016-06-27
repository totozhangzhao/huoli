/*
  首页banner视图
*/
import $ from "jquery";
import Backbone from "backbone";
import {sendPost} from "app/client/mall/js/lib/mall-request.js";
import tplUtil from "app/client/mall/js/lib/mall-tpl.js";
import * as mallUitl from "app/client/mall/js/lib/util.js";
import {toast} from "com/mobile/widget/hint/hint.js";
import Swipe from "com/mobile/lib/swipe/swipe.js";

const BannerView = Backbone.View.extend({

  el: "#home-banner",

  template: require("app/client/mall/tpl/home/v2/banner.tpl"),

  initialize() {
    this.fetchData();
  },

  fetchData() {
    sendPost("getBanners", null, (err, result) => {
      if (err) {
        toast(err.message, 1500);
        return;
      }

      if (result.length === 0) {
        return;
      }
      this.bannerData = result;
      this.render();
    });
  },

  render() {
    if(!this.bannerData) {
      this.$el.hide();
      return ;
    }
    this.$el.html(this.template({
      dataList: this.bannerData,
      appName  : mallUitl.getAppName(),
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
      speed: 400,
      auto: 3000,
      continuous: true,
      disableScroll: false,
      stopPropagation: false,
      callback(index) {
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
