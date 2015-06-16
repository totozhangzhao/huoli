var NativeAPI  = require("app/client/common/lib/native/native-api.js");
var async      = require("async");

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

  return function(callback, opitons) {
    opitons = opitons || {};

    var reset = opitons.reset || false;

    if ( (userDataStore.deviceInfo && userDataStore.userInfo) && !reset ) {
      callback(null, userDataStore);
      return;
    }

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
        if (userData.deviceInfo.name === "hbgj") {
          userData.userInfo.hbauthcode = userData.userInfo.authcode;
          userData.userInfo.hbuserid   = userData.userInfo.userid;
          next(null, userData);
        } else {
          NativeAPI.invoke("getUserInfo", {
            appName: "hbgj"
          }, function(err, data) {
            userData.userInfo.hbauthcode = data.authcode;
            userData.userInfo.hbuserid   = data.userid;
            next(null, userData);
          });
        }
      }
    ], function(err, result) {
      if (err) {
        callback(err);
        return;
      }

      userDataStore.deviceInfo = result.deviceInfo;
      userDataStore.userInfo   = result.userInfo;
      callback(null, userDataStore);
    });
  };
}());
