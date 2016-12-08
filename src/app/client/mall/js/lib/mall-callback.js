var mallEvent = require("app/client/mall/js/lib/mall-event.js");
var NativeAPI = require("app/client/common/lib/native/native-api.js");

mallEvent.on("mall-advance", function(url) {
  NativeAPI.invoke("createWebViewAdvance", { url: url });
});

exports.dispatch = function(result) {
  if (result && result.preload) {
    mallEvent.emit("mall-advance", result.preload);
  }
};
