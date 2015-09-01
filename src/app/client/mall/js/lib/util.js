var parseUrl = require("com/mobile/lib/url/url.js").parseUrlSearch;
var cookie   = require("com/mobile/lib/cookie/cookie.js");

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

exports.isHangban = function() {
  return /hbgj/i.test(exports.getAppName());
};

exports.getUpgradeUrl = function() {
  return "http://cdn.rsscc.cn/guanggao/upgrade/upgrade.html";
};
