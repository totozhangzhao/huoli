var NativeAPI   = require("app/client/common/lib/native/native-api.js");
var handleError = require("app/client/test/common/native/util.js").handleError;

exports.get = function(key, callback) {
  NativeAPI.invoke("storage", {
    action: "get",
    key: key
  }, function(err, data) {
    if (err) {
      handleError(err);
      return;
    }

    callback(JSON.parse(data.value || null));
  });
};

exports.set = function(key, value, callback) {
  NativeAPI.invoke("storage", {
    action: "set",
    key: key,
    value: typeof value === "string" ? value : JSON.stringify(value)
  }, function(err, data) {
    if (err) {
      handleError(err);
      return;
    }

    callback(data ? data.value : "");
  });
};
