var parseUrl = require("com/mobile/lib/url/url.js").parseUrlSearch;
var cookie   = require("com/mobile/lib/cookie/cookie.js");

exports.getAppName = (function() {
  var name = "gtgj";

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
  var flag = /hbgj/i.test(exports.getAppName());
  return flag;
};

exports.getUpgradeUrl = function() {
  return "http://cdn.rsscc.cn/guanggao/upgrade/upgrade.html";
};
