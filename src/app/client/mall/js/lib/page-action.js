var NativeAPI  = require("app/client/common/lib/native/native-api.js");

exports.update = function(options) {
  NativeAPI.registerHandler("back", function(params, callback) {

    // close hashchange
    options.isUpdate = false;

    callback(null, {
      preventDefault: options.isUpdate
    });

    if (options.isUpdate) {
      NativeAPI.invoke("webViewCallback", {
        url: options.url
      });
    }
  });
};
