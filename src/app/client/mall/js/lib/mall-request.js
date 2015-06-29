var requestAPI = require("app/client/mall/js/lib/request.js");
var parseUrl   = require("com/mobile/lib/url/url.js").parseUrlSearch;
var cookie     = require("com/mobile/lib/cookie/cookie.js");

var serverUrl = "/bmall/rest/";

if ( /hbgj/i.test(parseUrl().appName) ) {
  serverUrl = "/bmall/rest/hb/";
}

if ( /hbgj/i.test(cookie.get("appName")) ) {
  serverUrl = "/bmall/rest/hb/";
}

// method, params, callback
exports.sendPost = requestAPI.createSendPost({
  url: serverUrl
});
