var $         = require("jquery");
var _         = require("lodash");
var NativeAPI = require("app/client/common/lib/native/native-api.js");
var echo      = require("com/mobile/lib/echo/echo.js");
var mallUitl  = require("app/client/mall/js/lib/util.js");
var logger    = require("com/mobile/lib/log/log.js");
var UrlUtil   = require("com/mobile/lib/url/url.js");

exports.initRem = function() {
  var setRoot = function() {
    var rootSize = ($("body").width() / 10).toFixed(1);
    $("html").css({ "font-size": rootSize + "px" });
  };

  setRoot();
  window.onresize = _.debounce(setRoot, 150);
};

exports.initRem();

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

  var separateHash = url.split("#");
  var hash = "";

  if ( separateHash.length > 1 ) {
    url  = separateHash[0];
    hash = "#" + separateHash[1];
  }

  if ( $cur.data() && /\/fe\//.test(url) ) {
    url = url.indexOf("?") >= 0 ? url + "&" : url + "?";
    url = url + $.param( $cur.data() );
  }

  exports.createNewView({
    url: url + hash,
    title: $cur.data("title")
  });
};

exports.createNewView = (function() {
  return _.debounce(function(options) {
    var url = options.url;

    if (url === "" || url === null || url === undefined) {
      return;
    }

    NativeAPI.invoke("createWebView", {
      url: url,
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

exports.updateViewTitle = function(title) {
  var doc = window.document;
  title = title || doc.title;
  doc.title = title;
  NativeAPI.invoke("updateTitle", {
    text: title
  });
};

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

exports.initTracker = function(tag) {
  return function(data) {
    var category = mallUitl.getAppName() + "-" + tag + "_" + data.title;
    if (data.productid) {
      category += "_" + data.productid;
    }
    logger.track(category, "View PV", data.from);
  };
};

$("body").on("click", "a, button, [data-log-mall-click]", function(e) {
  var $cur = $(e.currentTarget);
  if ( $cur.data("logClick") ) {
    return;
  }
  var eventText = $cur.data("logMallClick") || $cur.data("title") || $cur.text() || $cur.val() || "--btn--";
  eventText = eventText.replace(/\r?\n|\r/g, "").replace(/\s+/g, " ").trim();
  var category = mallUitl.getAppName() + "EV_" + window.document.title + "_" + eventText;
  logger.track(category, "EV click", UrlUtil.parseUrlSearch().from || "--");
});
