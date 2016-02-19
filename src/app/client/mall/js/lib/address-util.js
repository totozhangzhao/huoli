var sendPost = require("app/client/mall/js/lib/mall-request.js").sendPost;
var async    = require("async");
var appInfo  = require("app/client/mall/js/lib/app-info.js");
var toast    = require("com/mobile/widget/hint/hint.js").toast;
var _        = require("lodash");

exports.getList = function(callback) {
  async.waterfall([
    function(next) {
      appInfo.getUserData(function(err, userData) {
        if (err) {
          toast(err.message, 1500);
          return;
        }

        next(null, userData);
      });
    },
    function(userData, next) {
      var params = _.extend({}, userData.userInfo, {
        p: userData.deviceInfo.p
      });

      sendPost("getAddress", params, function(err, data) {
        next(err, data);
      });
    }
  ], function(err, result) {
    if ( _.isFunction(callback) ) {
      callback(err, result);
    }
  });
};

exports.setDefault = function(addressData, callback) {
  async.waterfall([
    function(next) {
      appInfo.getUserData(function(err, userData) {
        if (err) {
          toast(err.message, 1500);
          return;
        }

        next(null, userData);
      });
    },
    function(userData, next) {
      var params = _.extend({}, userData.userInfo, addressData, {
        p: userData.deviceInfo.p,
      });

      // 是否为默认地址
      // 1-是
      // 0-否
      params.def = 1;
      
      sendPost("updateAddress", params, function(err, data) {
        next(err, data);
      });
    }
  ], function(err, result) {
    if ( _.isFunction(callback) ) {
      callback(err, result);
    }
  });
};

exports.remove = function(id, callback) {
  exports.handleAddress("delAddress", id, callback);
};

exports.handleAddress = function(method, id, callback) {
  async.waterfall([
    function(next) {
      appInfo.getUserData(function(err, userData) {
        if (err) {
          toast(err.message, 1500);
          return;
        }

        next(null, userData);
      });
    },
    function(userData, next) {
      var params = _.extend({}, userData.userInfo, {
        p: userData.deviceInfo.p,
        addressid: id
      });

      sendPost(method, params, function(err, data) {
        next(err, data);
      });
    }
  ], function(err, result) {
    if ( _.isFunction(callback) ) {
      callback(err, result);
    }
  });
};
