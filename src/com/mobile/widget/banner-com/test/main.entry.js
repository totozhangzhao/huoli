var $     = require("jquery");
var Swipe = require("com/mobile/lib/swipe/swipe.js");

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
