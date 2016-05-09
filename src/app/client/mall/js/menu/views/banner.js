var $        = require("jquery");
var Backbone = require("backbone");
var Swipe    = require("com/mobile/lib/swipe/swipe.js");
var tplUtil  = require("app/client/mall/js/lib/mall-tpl.js");
var mallUitl = require("app/client/mall/js/lib/util.js");

var AppView = Backbone.View.extend({
  el: "#top-banner",

  template: require("app/client/mall/tpl/menu/grab/grab-banner.tpl"),

  initialize: function () {
    this.$el.html(this.template({
      bannerList: this.model,
      appName: mallUitl.getAppName(),
      tplUtil: tplUtil
    }));

    var $SwipeBox = $("#top-banner .js-banner-box");
    var $index    = $("#top-banner .js-banner-index");

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
module.exports = AppView;
