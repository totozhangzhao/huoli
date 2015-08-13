var $          = require("jquery");
var NativeAPI  = require("app/client/common/lib/native/native-api.js");

// touch status
(function() {
  $("body")
    .on("touchstart", "a, .js-touch-state", function() {
      $(this).addClass("touch");
    })
    .on("touchmove", "a, .js-touch-state", function() {
      $(this).removeClass("touch");
    })
    .on("touchend", "a, .js-touch-state", function() {
      $(this).removeClass("touch");
    })
    .on("touchcancel", "a, .js-touch-state", function() {
      $(this).removeClass("touch");
    });
}());

exports.createAView = function(e) {
  var $cur = $(e.currentTarget);
  var url = $cur.prop("href");

  if (url === "" || url === null || url === undefined) {
    return true;
  }

  // <a href="tel:+6494461709">61709</a>
  if ( url.indexOf(":") !== -1 && !/http/.test(url) ) {
    return true;
  }

  e.preventDefault();  

  if ( $cur.data() ) {
    url = url.indexOf("?") >= 0 ? url : url + "?";
    url = url + $.param( $cur.data() );
  }

  exports.createNewView({
    url: url,
    title: $cur.data("title")
  });
};

exports.createNewView = function(options) {
  NativeAPI.invoke("createWebView", {
    url: options.url,
    controls: [
      {
        type: options.type || "title",
        text: options.title || ""
      }
    ]
  }, function(err) {
    if ( err && (err.code === -32603) ) {
      window.location.href = options.url;
    }
  });
};
