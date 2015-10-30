var $         = require("jquery");
var _         = require("lodash");
var NativeAPI = require("app/client/common/lib/native/native-api.js");
var echo      = require("com/mobile/lib/echo/echo.js");

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

  if ( $cur.data() && /\/fe\//.test(url) ) {
    url = url.indexOf("?") >= 0 ? url + "&" : url + "?";
    url = url + $.param( $cur.data() );
  }

  exports.createNewView({
    url: url,
    title: $cur.data("title")
  });
};

exports.createNewView = (function() {
  return _.debounce(function(options) {
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
  }, 1000, true);
}());

exports.imageDelay = function(options) {
  var config = _.extend({
    offset: 250,
    throttle: 250,
    unload: false,
    callback: function(elem) {
      var $elem = $(elem);

      if ( !$elem.hasClass("op0") ) {
        return;
      }

      if ( $elem.is("img") ) {
        $elem.on("load", function() {
          setTimeout(function() {
            $elem.addClass("op1");
          }, 150);
        });
      } else {
        setTimeout(function() {
          $elem.addClass("op1");
        }, 150);
      }
    }
  }, options || {});

  echo.init(config);
};

exports.initRem = function() {
  var setRoot = _.debounce(function() {      
    var rootSize = ($(".rem-main").width() / 10).toFixed(1);
    $("html").css({ "font-size": rootSize + "px" });      
  }, 150);

  window.onresize = setRoot;
  setRoot();
};
