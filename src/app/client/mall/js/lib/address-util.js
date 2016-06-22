import _ from "lodash";
import {sendPost} from "app/client/mall/js/lib/mall-request.js";
import * as mallPromise from "app/client/mall/js/lib/mall-promise.js";

export function getList(callback) {
  mallPromise
    .getAppInfo()
    .then(userData => {
      const params = _.extend({}, userData.userInfo, {
        p: userData.deviceInfo.p
      });

      return new Promise((resolve, reject) => {
        sendPost("getAddress", params, (err, data) => {
          if (err) {
            reject(err);
          } else {
            resolve(data);
          }
        });
      });
    })
    .then(result => {
      if ( _.isFunction(callback) ) {
        callback(result);
      }
    })
    .catch(mallPromise.catchFn);
}

export function setDefault(addressData, callback) {
  mallPromise
    .getAppInfo()
    .then(userData => {
      const params = _.extend({}, userData.userInfo, addressData, {
        p: userData.deviceInfo.p
      });

      // 是否为默认地址
      // 1-是
      // 0-否
      params.def = 1;

      return new Promise((resolve, reject) => {
        sendPost("updateAddress", params, (err, data) => {
          if (err) {
            reject(err);
          } else {
            resolve(data);
          }
        });
      });
    })
    .then(result => {
      if ( _.isFunction(callback) ) {
        callback(result);
      }
    })
    .catch(mallPromise.catchFn);
}

export function remove(id, callback) {
  exports.handleAddress("delAddress", id, callback);
}

export function handleAddress(method, id, callback) {
  mallPromise
    .getAppInfo()
    .then(userData => {
      const params = _.extend({}, userData.userInfo, {
        p: userData.deviceInfo.p,
        addressid: id
      });

      return new Promise((resolve, reject) => {
        sendPost(method, params, (err, data) => {
          if (err) {
            reject(err);
          } else {
            resolve(data);
          }
        });
      });
    })
    .then(result => {
      if ( _.isFunction(callback) ) {
        callback(result);
      }
    })
    .catch(mallPromise.catchFn);
}
