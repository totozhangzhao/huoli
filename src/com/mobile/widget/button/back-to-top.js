var $      = require("jquery");
var _      = require("lodash");
var widget = require("app/client/mall/js/lib/common.js");

var tmpl = require("app/client/mall/tpl/back-to-top.tpl");
var $toTop = $( tmpl() );

$toTop
  .hide()
  .appendTo("body")
  .on("click", ".js-top", function(e) {
    e.preventDefault();
    $("html, body")
      .animate({
        scrollTop: 0
      }, 333);
  })
  .on("click", ".js-assistance", function(e) {
    widget.createAView(e);
  });

var $win = $(window);
var showBox = _.debounce(function() {
  if ( $win.scrollTop() > 100 ) {
    $toTop.fadeIn(333);
  } else {
    $toTop.fadeOut(333);
  }
}, 150);

$win.on("scroll", showBox);
