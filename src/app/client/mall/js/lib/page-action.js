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
exports.setClose = function(opts) {
  var options = opts || { preventDefault: true };

  NativeAPI.registerHandler("back", function(params, callback) {
    callback(null, { preventDefault: options.preventDefault });
    if (options.preventDefault) {
      NativeAPI.invoke("close");
    }
  });
};

exports.showRightButton = function(options) {
  options.action = "show";

  NativeAPI.invoke("updateHeaderRightBtn", options, function(err) {
    if (err) {
      window.console.log(err.message);
      return;
    }
  });
};

exports.hideRightButton = function() {
  NativeAPI.invoke("updateHeaderRightBtn", {
    action: "hide"
  }, function(err) {
    if (err) {
      window.console.log(err.message);
      return;
    }
  });
};
