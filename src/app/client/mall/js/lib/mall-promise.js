var Promise = require("com/mobile/lib/promise/npo.js");
var appInfo = require("app/client/mall/js/lib/app-info.js");
var toast   = require("com/mobile/widget/hint/hint.js").toast;

exports.appInfo = new Promise(function(resolve, reject) {
  appInfo.getUserData(function(err, userData) {
    if (err) {
      reject(err);
    } else {
      resolve(userData);
    }
  });
});

exports.catchFn = function(err) {
  if (err.message) {
    toast(err.message, 1500);
  } else {
    toast(JSON.stringify(err), 1500);
  }

  if (err instanceof Error) {
    window.console.log("Error Message: " + err.message);
    window.console.log("Error Stack: " + err.stack);
  }
};
