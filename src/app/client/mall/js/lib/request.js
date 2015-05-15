var jsonrpc  = require("jsonrpc");
var BasicRequest = require("app/client/common/lib/http/http.js").BasicRequest;

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

    // test
    window.console.log(JSON.stringify(data));

    switch (data.type) {
      case "success":
        callback(null, data.payload.result);
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
    var data    = jsonrpc.request(idGenerator(), method, params);
    var dataStr = JSON.stringify(data);
    var cb      = callbackWraper(callback);
    basicRequest.request("POST", null, null, dataStr, cb);
  };
};
