var Backbone = require("backbone");
var jsonrpc  = require("jsonrpc");
var _        = require("underscore");
var BasicRequest = require("app/client/common/lib/http/http.js").BasicRequest;
var echo        = require("app/client/test/common/native/util.js").echo;
var handleError = require("app/client/test/common/native/util.js").handleError;

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

var sendPost = function(method, params, callback) {
  var data    = jsonrpc.request(idGenerator(), method, params);
  var dataStr = JSON.stringify(data);
  var cb      = callbackWraper(callback);
  basicRequest.request("POST", null, null, dataStr, cb);
};

var USER_DATA = {
  uid: "20daa468fe010000b",
  ua : "372306073653696/3B2E0AA8F64DC5332854C1C208B4DC27"
};

var AppView = Backbone.View.extend({
  el: "body",
  events: {
    "click .js-getUserInfo"  : "getUserInfo",
    "click .js-createOrder"  : "createOrder",
    "click .js-orderList"    : "orderList",
    "click .js-orderDetail"  : "orderDetail",
    "click .js-productDetail": "productDetail"
  },
  initialize: function() {
    // var requestObj = jsonrpc.request("123", "update", {list: [1, 2, 3]});
    // console.log(requestObj);
    // console.log(JSON.stringify(requestObj));

    // var data = jsonrpc.parse(JSON.stringify(requestObj));
    // console.log(data);
  },
  getUserInfo: function() {
    sendPost("getUserInfo", USER_DATA, function(err, data) {
      if (err) {
        return handleError(err);
      }

      echo(JSON.stringify(data));
    });
  },
  createOrder: function() {
    var params = _.extend({}, USER_DATA, {
      productid: 2
    });

    sendPost("createOrder", params, function(err, data) {
      if (err) {
        return handleError(err);
      }

      echo(JSON.stringify(data));
    });
  },
  orderList: function() {
    sendPost("orderList", USER_DATA, function(err, data) {
      if (err) {
        return handleError(err);
      }

      echo(JSON.stringify(data));
    });
  },
  orderDetail: function() {
    var params = _.extend({}, USER_DATA, {
      orderid: "4314115865750"
    });

    sendPost("orderDetail", params, function(err, data) {
      if (err) {
        return handleError(err);
      }

      echo(JSON.stringify(data));
    });
  },
  productDetail: function() {
    var params = _.extend({}, USER_DATA, {
      productid: 2
    });

    sendPost("productDetail", params, function(err, data) {
      if (err) {
        return handleError(err);
      }

      echo(JSON.stringify(data));
    });
  }
});

new AppView();
