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
  var userData = {};

  return function(callback, opitons) {
    opitons = opitons || {};

    var reset = opitons.reset || false;

    if ( (userData.deviceInfo && userData.userInfo) && !reset ) {
      callback(null, userData);
      return;
    }

    async.auto({
      deviceInfo: function(next) {
        NativeAPI.invoke("getDeviceInfo", null, function(err, data) {
          if (err) {
            next(null, DEVICE_INFO);
            return;
          }

          next(null, data);
        });
      },
      userInfo: function(next) {
        NativeAPI.invoke("getUserInfo", null, function(err, data) {
          if ( err && (String(err.code) === "-32001") ) {
            next(null, USER_INFO);
            return;
          } else if (err) {
            next(err);
            return;            
          }

          data.uid      = data.uid      || "";
          data.userid   = data.userid   || "";
          data.authcode = data.authcode || "";

          next(null, data);
        });
      }
    }, function(err, results) {
      if (err) {
        callback(err);
        return;
      }

      userData.deviceInfo = results.deviceInfo;
      userData.userInfo   = results.userInfo;

      callback(null, userData);
    });
  };
}());
