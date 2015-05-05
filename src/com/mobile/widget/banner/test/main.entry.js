var Swiper = require("com/mobile/lib/swiper/js/swiper.jquery.js");

new Swiper(".swiper-container", {
  pagination: ".swiper-pagination",
  direction: "horizontal",
  loop: true,
  autoplay: 3000,
  autoplayDisableOnInteraction: false,
  paginationClickable: true
});
