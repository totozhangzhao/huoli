var NativeAPI  = require("app/client/common/lib/native/native-api.js");

// 触发 hashchange。Android 上有些情况下无法触发。接口有 bug，弃用此方案。
exports.update = function(options) {
  NativeAPI.registerHandler("back", function(params, callback) {

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

// hashchange 的情况下还是会页面后退，而非关闭 WebView。
exports.setClose = function() {
  NativeAPI.registerHandler("back", function(params, callback) {
    callback(null, { preventDefault: true });
    NativeAPI.invoke("close");
  });
};
