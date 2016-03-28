var Promise = require("com/mobile/lib/promise/npo.js");
var appInfo = require("app/client/mall/js/lib/app-info.js");
var toast   = require("com/mobile/widget/hint/hint.js").toast;

exports.getAppInfo = function(reset) {
  return new Promise(function(resolve, reject) {
    appInfo.getUserData(function(err, userData) {
      if (err) {
        reject(err);
      } else {
        resolve(userData);
      }
    }, { reset: reset || false });
  });
};

exports.catchFn = function(err) {
  if (err.message) {
    toast(err.message, 1500);
  } else {
    toast(JSON.stringify(err), 1500);
  }

  if (err instanceof Error) {
    window.console.log("Error Message: \n" + err.message);
    window.console.log("Error Stack: \n" + err.stack);
  }
};
