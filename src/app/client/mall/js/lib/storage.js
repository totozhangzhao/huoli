var Storage   = require("com/mobile/lib/storage/storage.js");
var NativeAPI = require("app/client/common/lib/native/native-api.js");

var storage = new Storage("mall");

var useLocalStorage = false;

exports.get = function(key, callback) {
  NativeAPI.invoke("storage", {
    action: "get",
    key: key
  }, function(err, data) {
    if (useLocalStorage) {
      setTimeout(function() {
        callback(storage.get(key) || null);
      }, 300);
    } else {
      if (!data) {
        data = {};
      }

      callback(JSON.parse(data.value || null));
    }
  });
};

exports.set = function(key, value, callback) {
  NativeAPI.invoke("storage", {
    action: "set",
    key: key,
    value: typeof value === "string" ? value : JSON.stringify(value)
  }, function(err, data) {
    if (useLocalStorage) {
      storage.set(key, value);

      setTimeout(function() {
        callback(value);
      }, 0);
    } else {
      callback(data ? data.value : "");
    }
  });
};
