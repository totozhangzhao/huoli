var $        = require("jquery");
var parseUrl = require("com/mobile/lib/url/url.js").parseUrlSearch;
var cookie   = require("com/mobile/lib/cookie/cookie.js");

// touch status
(function() {

var intervalId;
  $("body")
    .on("touchstart", "a, .js-touch-state", function() {

      intervalId = setTimeout(function () {
        $(this).addClass("touch");
      }.bind(this),50 + Math.random() * 100);
    })
    .on("touchmove", "a, .js-touch-state", function() {
      window.clearInterval(intervalId);
      $(this).removeClass("touch");
    })
    .on("touchend", "a, .js-touch-state", function() {
      window.clearInterval(intervalId);
      $(this).removeClass("touch");
    })
    .on("touchcancel", "a, .js-touch-state", function() {
      window.clearInterval(intervalId);
      $(this).removeClass("touch");
    });
}());

exports.getAppName = (function() {
  var name = "gtgj";

  // mall.rsscc.cn
  // hbmall.rsscc.cn
  if ( /hb/.test(window.location.hostname) ) {
    name = "hbgj";
  }

  var urlName    = parseUrl().appName;
  var cookieName = cookie.get("appName");

  if (urlName) {
    name = urlName;
  }

  if (cookieName) {
    name = cookieName;
  }

  return function() {
    return name;
  };
}());

exports.isHangbanFunc = function() {
  return /hbgj/i.test(exports.getAppName());
};

exports.isAppFunc = function() {
  var appName = cookie.get("appName");

  if ( /gtgj|hbgj/i.test(appName) ) {
    return true;
  } else {
    return false;
  }
};

exports.getHangbanAppUrl = function() {
  return "http://a.app.qq.com/o/simple.jsp?pkgname=com.flightmanager.view";
};

exports.getGaotieAppUrl = function() {
  return "http://a.app.qq.com/o/simple.jsp?pkgname=com.gtgj.view";
};

exports.getUpgradeUrl = function() {
  return "http://cdn.rsscc.cn/guanggao/upgrade/upgrade.html";
};
