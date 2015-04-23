var Backbone  = require("backbone");
var storage   = require("app/client/test/common/native/storage.js");
var NativeAPI = require("app/client/common/lib/native/native-api.js");
var $         = require("jquery");

var handleError = function(err) {
    window.alert("出错了！[code:"+err.code+"]: " + err.message);
};

var AppView = Backbone.View.extend({
  el: "body",
  events: {
    "click .js-showUserAgent": "showUserAgent",
    "click .js-alert"        : "alert",
    "click .js-storage-set"  : "setStorage",
    "click .js-storage-get"  : "getStorage",
    "click .js-getDeviceInfo": "getDeviceInfo"
  },
  showUserAgent: function() {
    var ua = window.navigator.userAgent;
    $("#echo").text(ua);
  },
  alert: function() {
    NativeAPI.invoke(
      "alert", {
        title: "这是标题",
        message: "这是消息",
        btn_text: "确定按钮"
      },
      function(err, data) {
        if (err) {
          return handleError(err);
        }
        switch (data.value) {
          case data.YES:
            window.alert("你点了确定按钮");
            break;
          case data.CLOSE:
            window.alert("你使用其他方式关闭了弹窗");
            break;
          default:
            window.alert("未知动作，返回code是[" + data.value + "]");
        }
      }
    );
  },
  setStorage: function() {
    var data = {
      name: "apple"
    };

    storage.set("test", data, function() {
      window.alert("storage set test");
    });
  },
  getStorage: function() {
    storage.get("test", function(data) {
      window.alert(JSON.stringify(data));
    });
  },
  getDeviceInfo: function() {
    NativeAPI.invoke(
      "getDeviceInfo",
      null,
      function(err, data) {
        if (err) {
          return handleError(err);
        }

        window.alert(JSON.stringify(data));
      }
    );
  }
});

new AppView();