var requestAPI = require("app/client/mall/js/lib/request.js");
var Util       = require("app/client/mall/js/lib/util.js");

var serverUrl = "/bmall/rest/";

if ( Util.isHangbanFunc() ) {
  serverUrl = "/bmall/rest/hb/";
}

// method, params, callback
exports.sendPost = requestAPI.createSendPost({
  url: serverUrl
});
