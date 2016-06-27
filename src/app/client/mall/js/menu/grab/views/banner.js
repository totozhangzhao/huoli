import $ from "jquery";
import Backbone from "backbone";
import Swipe from "com/mobile/lib/swipe/swipe.js";
import tplUtil from "app/client/mall/js/lib/mall-tpl.js";
import * as mallUitl from "app/client/mall/js/lib/util.js";

const AppView = Backbone.View.extend({
  el: "#top-banner",

  template: require("app/client/mall/tpl/menu/grab/grab-banner.tpl"),

  initialize() {
    this.$el.html(this.template({
      bannerList: this.model,
      appName: mallUitl.getAppName(),
      tplUtil
    }));

    const $SwipeBox = $("#top-banner .js-banner-box");
    const $index    = $("#top-banner .js-banner-index");

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
export default AppView;
