var Backbone = require("backbone");
var _        = require("lodash");
var requestAPI = require("app/client/mall/js/lib/request.js");
var echo        = require("app/client/test/common/native/util.js").echo;
var handleError = require("app/client/test/common/native/util.js").handleError;

// method, params, callback
var sendPost = requestAPI.createSendPost({
  url: "/bmall/rest/"
});

var USER_DATA = {
  phone   : "13801286305",
  authcode: "372306073653696/web/1431519535/A5A6746E246549FC1AF9D76E0F70B144",
  uid     : "20b8116bba0000002",
  userid  : "372306073653696"
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
