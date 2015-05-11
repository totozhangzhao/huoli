var NativeAPI = require("app/client/common/lib/native/native-api.js");
var $         = require("jquery");

var echo = function(text) {
  $("#echo")
    .hide()
    .text(text)
    .fadeIn();
};

var handleError = function(err) {
    echo("出错了！[code:"+err.code+"]: " + err.message);
};

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
