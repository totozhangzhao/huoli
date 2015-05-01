var Backbone = require("backbone");
var jsonrpc  = require("jsonrpc");
var $        = require("jquery");
var BasicRequest = require("app/client/common/lib/http/http.js").BasicRequest;

var basicRequest = new BasicRequest({
  url: "/bmall/rest/"
});

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
        callback(null, data.payload.success);
        break;
      case "error":
        callback(data.payload.error);
        break;
      default:
        callback(data.payload);
    }
  };
};

var sendPost = function(method, params, callback) {
  var data = jsonrpc.request(idGenerator(), method, params);
  var cb   = callbackWraper(callback);
  basicRequest.request("POST", null, null, data, cb);
};

var handleError = function(err) {
  window.alert("出错了！[code:" + err.code + "]: " + err.message);
};

var AppView = Backbone.View.extend({
  el: "body",
  events: {
    "click .js-showUserAgent": "showUserAgent",
    "click .js-post-request" : "postRequest"
  },
  initialize: function() {
    var requestObj = jsonrpc.request("123", "update", {list: [1, 2, 3]});
    console.log(requestObj);

    var data = jsonrpc.parse(JSON.stringify(requestObj));
    console.log(data);
  },
  showUserAgent: function() {
    var ua = window.navigator.userAgent;
    $("#echo").text(ua);
  },
  postRequest: function() {
    var data = {
      userId: "1615BBAAF41ABDC59CFA7EBE8C643919",
      token : "52617950743134537162574f30614f6352615657472f2b6f"
    };

    sendPost("getUserInfo", data, function(err, data) {
      if (err) {
        return handleError(err);
      }

      window.alert(JSON.stringify(data));
    });
  }
});

new AppView();
