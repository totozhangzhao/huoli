var NativeAPI  = require("app/client/common/lib/native/native-api.js");
var async      = require("async");
var storage    = require("app/client/mall/js/lib/storage.js");
var Util       = require("com/mobile/lib/util/util.js");

// @API Name
// getUserData
//
// @param
// callback(err, data) function
//
// @return
// userData
// {
//   deviceInfo, // NativeAPI: getDeviceInfo
//   userInfo    // NativeAPI: getUserInfo
// }
exports.getUserData = (function() {
  var DEVICE_INFO = {
    name: "gtgj"
  };

  var USER_INFO = {
    uid: "",
    userid: "",
    authcode: ""
  };

  // memorization
  var userDataStore = {};

  var checkUserData = function(userData) {
    if (userData &&
      userData.userInfo &&
      userData.userInfo.uid &&
      userData.userInfo.userid &&
      userData.userInfo.authcode
    ) {
      return true;
    } else {
      return false;
    }
  };

  return function(callback, opitons) {
    opitons = opitons || {};

    var reset = opitons.reset || false;

    if ( checkUserData(userDataStore) && !reset ) {
      // window.alert("from closure - userid: " + userDataStore.userInfo.userid);
      callback(null, userDataStore);
      return;
    }

    var getAppData = function() {
      async.waterfall([
        function(next) {
          NativeAPI.invoke("getDeviceInfo", null, function(err, data) {
            if (err) {
              next(null, DEVICE_INFO);
              return;
            }

            next(null, data);
          });
        },
        function(deviceInfo, next) {

          // 兼容 pro 版本
          if ( /pro/.test(deviceInfo.name) ) {
            deviceInfo.__name = deviceInfo.name;
            deviceInfo.name = deviceInfo.name.replace(/pro/, "");
          }

          var params = {
            appName: deviceInfo.name
          };

          NativeAPI.invoke("getUserInfo", params, function(err, data) {
            if ( err && (String(err.code) === "-32001") ) {
              next(null, {
                deviceInfo: deviceInfo,
                userInfo: USER_INFO
              });
              return;
            } else if (err) {
              window.console.log(JSON.stringify(err));
              next(null, {
                deviceInfo: deviceInfo,
                userInfo: USER_INFO
              });
              return;            
            }

            data = Util.isObject(data) ? data : {};
            data.uid      = data.uid      || "";
            data.userid   = data.userid   || "";
            data.authcode = data.authcode || "";

            next(null, {
              deviceInfo: deviceInfo,
              userInfo: data
            });
          });
        },
        function(userData, next) {

          // 兼容 version 3.2
          if (userData.userInfo.hbuserid) {
            next(null, userData);
          } else if (userData.deviceInfo.name === "hbgj") {
            userData.userInfo.hbauthcode = userData.userInfo.authcode;
            userData.userInfo.hbuserid   = userData.userInfo.userid;
            next(null, userData);
          } else {
            NativeAPI.invoke("getUserInfo", {
              appName: "hbgj"
            }, function(err, data) {
              if (err) {
                next(null, userData);
                return;            
              }

              data = Util.isObject(data) ? data : {};
              userData.userInfo.hbauthcode = data.authcode;
              userData.userInfo.hbuserid   = data.userid;
              next(null, userData);
            });
          }
        },
        function(userData, next) {
          if ( checkUserData(userData) ) {
            storage.set("userDataStore", userData, function() {
              next(null, userData);
            });
          } else {
            next(null, userData);
          }
        }
      ], function(err, result) {
        if (err) {
          callback(err);
          return;
        }

        if ( checkUserData(result) ) {
          userDataStore.deviceInfo = result.deviceInfo;
          userDataStore.userInfo   = result.userInfo;
        }

        // window.alert("from native api - userid: " + result.userInfo.userid);
        callback(null, result);
      });
    };

    if ( !reset ) {
      storage.get("userDataStore", function(data) {
        data = Util.isObject(data) ? data : {};
        if ( checkUserData(data) ) {
          userDataStore = data;
          // window.alert("from storage - userid: " + data.userInfo.userid);
          callback(null, data);
        } else {
          getAppData();
        }
      });
      return;
    }

    getAppData();
  };
}());
