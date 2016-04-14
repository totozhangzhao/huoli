var $         = require("jquery");
var _         = require("lodash");
var NativeAPI = require("app/client/common/lib/native/native-api.js");
var echo      = require("com/mobile/lib/echo/echo.js");
var mallUitl  = require("app/client/mall/js/lib/util.js");
var logger    = require("com/mobile/lib/log/log.js");
var UrlUtil   = require("com/mobile/lib/url/url.js");

exports.initRem = function() {
  var docEl = document.documentElement;
  var setRoot = function() {
    docEl.style.fontSize = (docEl.clientWidth / 10) + "px";
  };
  setRoot();
  var resizeEvent = "orientationchange" in window ? "orientationchange" : "resize";
  window.addEventListener(resizeEvent, _.debounce(setRoot, 150), false);
};

exports.initRem();

exports.createAView = function(e) {
  var $cur = $(e.currentTarget);
  var url = $cur.prop("href");
  var isEmpty = function(str) {
    return str === "" || str === null || str === undefined;
  };

  if ( isEmpty(url) ) {
    url = $cur.data("href");

    if ( isEmpty(url) ) {
      return true;
    }
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

/**
 * 数据统计
 *
 * 格式：
 * 页面类型_页面标题_产品ID，即 XXX_XXX_ID
 */

/**
 * 示例：
 * gtgj-detail_Jeep男士钱包优惠券_1000901
 * gtgj-detail_[第15期]IPhone6s Plus_1100259
 */
exports.initTracker = function(tag) {
  return function(data) {
    var category = mallUitl.getAppName() + "-" + tag + "_" + data.title;
    if (data.productid) {
      category += "_" + data.productid;
    }
    logger.track(category, "View PV", data.from);
  };
};

/**
 * 示例：
 * gtgj-ev-高铁商城-index-entrance_积分兑换
 * gtgj-ev-御泥坊刮刮卡_再玩一次_1000907
 */
$("body").on("click", "a, button, [data-log-mall-click]", function(e) {
  var $cur = $(e.currentTarget);
  var prefix = mallUitl.getAppName() + "-ev-" + window.document.title;
  var category;

  if ( $cur.data("logMallClick") ) {
    category = prefix + "-" + $cur.data("logMallClick");
  } else {
    category = $cur.data("title") || $cur.text() || $cur.val() || "btn";
    category = category.replace(/\r?\n|\r/g, "").replace(/\s+/g, " ").trim();
    category = prefix + "_" + category;
  }

  var urlObj = UrlUtil.parseUrlSearch();

  if (urlObj.productid) {
    category = category + "_" + urlObj.productid;
  }

  logger.track(category, "EV click", urlObj.from || "--");
});
