import {sendPost} from "app/client/mall/js/lib/mall-request.js";
import async from "async";
import appInfo from "app/client/mall/js/lib/app-info.js";
import {toast} from "com/mobile/widget/hint/hint.js";
import _ from "lodash";

export function getList(callback) {
  async.waterfall([
    next => {
      appInfo.getUserData((err, userData) => {
        if (err) {
          toast(err.message, 1500);
          return;
        }

        next(null, userData);
      });
    },
    (userData, next) => {
      const params = _.extend({}, userData.userInfo, {
        p: userData.deviceInfo.p
      });

      sendPost("getAddress", params, (err, data) => {
        next(err, data);
      });
    }
  ], (err, result) => {
    if ( _.isFunction(callback) ) {
      callback(err, result);
    }
  });
}

export function setDefault(addressData, callback) {
  async.waterfall([
    next => {
      appInfo.getUserData((err, userData) => {
        if (err) {
          toast(err.message, 1500);
          return;
        }

        next(null, userData);
      });
    },
    (userData, next) => {
      const params = _.extend({}, userData.userInfo, addressData, {
        p: userData.deviceInfo.p
      });

      // 是否为默认地址
      // 1-是
      // 0-否
      params.def = 1;

      sendPost("updateAddress", params, (err, data) => {
        next(err, data);
      });
    }
  ], (err, result) => {
    if ( _.isFunction(callback) ) {
      callback(err, result);
    }
  });
}

export function remove(id, callback) {
  exports.handleAddress("delAddress", id, callback);
}

export function handleAddress(method, id, callback) {
  async.waterfall([
    next => {
      appInfo.getUserData((err, userData) => {
        if (err) {
          toast(err.message, 1500);
          return;
        }

        next(null, userData);
      });
    },
    (userData, next) => {
      const params = _.extend({}, userData.userInfo, {
        p: userData.deviceInfo.p,
        addressid: id
      });

      sendPost(method, params, (err, data) => {
        next(err, data);
      });
    }
  ], (err, result) => {
    if ( _.isFunction(callback) ) {
      callback(err, result);
    }
  });
}
