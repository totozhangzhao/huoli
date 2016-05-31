var jsonrpc  = require("jsonrpc");
var BasicRequest = require("app/client/common/lib/http/http.js").BasicRequest;
var dispatch = require("app/client/mall/js/lib/mall-callback.js").dispatch;
var UrlUtil = require("com/mobile/lib/url/url.js");
var cookie = require("com/mobile/lib/cookie/cookie.js");

var idGenerator = (function() {
  var count = 0;
  return function() {
    return count += 1;
  };
}());

var callbackWraper = function(callback) {
  return function(err, data) {
    if (err) {
      return callback(err);
    }

    if (!data) {
      return callback(new Error("网络异常请稍后再试"));
    }

    data = jsonrpc.parse(data);

    switch (data.type) {
      case "success":
        var result = data.payload.result;
        var token = data.payload.token || result.token;
        if (token) {
          let cookieConfig = {
            expires: 86400,
            domain: location.hostname,
            path: "/"
          };
          cookie.set("token", token, cookieConfig);
        }
        callback(null, result);
        dispatch(result);
        break;
      case "error":
        callback(data.payload.error);
        break;
      default:
        callback(data.payload);
    }
  };
};

exports.createSendPost = function(options) {
  var basicRequest = new BasicRequest({
    url: options.url
  });

  return function(method, params, callback) {
    var openid = UrlUtil.parseUrlSearch().openid;
    if (openid) {
      params.openid = openid;
    }
    var data    = jsonrpc.request(idGenerator(), method, params);
    var dataStr = JSON.stringify(data);
    var cb      = callbackWraper(callback);
    basicRequest.request("POST", null, null, dataStr, cb);
  };
};
