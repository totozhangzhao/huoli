var Swiper = require("com/mobile/lib/swiper/js/swiper.jquery.js");

new Swiper(".swiper-container", {
  direction: "vertical",
  loop: false,
  onInit: function(swiper) {
    setTimeout(function() {
      swiper.slides
        .first()
        .addClass("active");
    }, 300);
  },
  onSlideChangeEnd: function(swiper) {
    swiper.slides
      .removeClass("active")
        .eq(swiper.activeIndex)
        .addClass("active");
  }
});
