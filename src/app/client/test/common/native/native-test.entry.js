var Backbone  = require("backbone");
var storage   = require("app/client/test/common/native/storage.js");
var NativeAPI = require("app/client/common/lib/native/native-api.js");
var echo        = require("app/client/test/common/native/util.js").echo;
var handleError = require("app/client/test/common/native/util.js").handleError;

var AppView = Backbone.View.extend({
  el: "body",
  events: {
    "click .js-native-back"     : "doNativeBack",
    "click .js-native-back-text": "doNativeBackText",
    "click .js-updateHeaderRightBtn"    : "rightButton",
    "click .js-updateHeaderRightBtnIcon": "rightButtonIcon",
    "click .js-createWebView": "newPage",
    "click .js-showUserAgent": "showUserAgent",
    "click .js-alert"        : "alert",
    "click .js-storage-set"  : "setStorage",
    "click .js-storage-get"  : "getStorage",
    "click .js-getDeviceInfo": "getDeviceInfo",
    "click .js-getUserInfo"  : "getUserInfo",
    "click .js-updateTitle"  : "updateTitle",
    "click .js-login"        : "login"
  },
  initialize: function() {
    NativeAPI.registerHandler("loginCompleted", function() {
      echo("JavaScript loginCompleted");
    });
  },
  doNativeBack: function() {
    NativeAPI.invoke("back");
  },
  doNativeBackText: function() {
    NativeAPI.registerHandler("back", function(params, callback) {
      echo("from javascript back...");

      setTimeout(function() {
        callback(null, {
          preventDefault: false
        });
      }, 2000);
    });

    NativeAPI.invoke("back");
  },
  rightButton: function() {
    NativeAPI.invoke("updateHeaderRightBtn", {
      action: "show",
      text: "订单",
      data: {
        list: [1, 2, 3]
      }
    });

    NativeAPI.registerHandler("headerRightBtnClick", function(data) {
      echo(JSON.stringify(data));
    });
  },
  rightButtonIcon: function() {
    NativeAPI.invoke("updateHeaderRightBtn", {
      action: "show",
      icon: require("app/client/test/common/native/image/icon.js").rightButtonIcon,
      text: "卡通",
      data: {
        list: [1, 2, 3]
      }
    });

    NativeAPI.registerHandler("headerRightBtnClick", function(data) {
      echo(JSON.stringify(data));
    });
  },
  newPage: function() {
    NativeAPI.invoke("createWebView", {
      url: window.location.origin + "/fe/app/client/test/common/native/native-b.html",
      controls: [
        {
          type: "title",
          text: "Native B ~"
        }
      ]
    });
  },
  showUserAgent: function() {
    var ua = window.navigator.userAgent;
    echo(ua);
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
            echo("你点了确定按钮");
            break;
          case data.CLOSE:
            echo("你使用其他方式关闭了弹窗");
            break;
          default:
            echo("未知动作，返回code是[" + data.value + "]");
        }
      }
    );
  },
  setStorage: function() {
    var data = {
      name: "apple"
    };

    storage.set("test", data, function() {
      echo("storage set test");
    });
  },
  getStorage: function() {
    storage.get("test", function(data) {
      echo(JSON.stringify(data));
    });
  },
  getDeviceInfo: function() {
    NativeAPI.invoke("getDeviceInfo", null, function(err, data) {
      if (err) {
        return handleError(err);
      }

      echo(JSON.stringify(data));
    });
  },
  getUserInfo: function() {
    NativeAPI.invoke("getUserInfo", null, function(err, data) {
      if (err) {
        return handleError(err);
      }

      if (!data.authcode) {
        NativeAPI.invoke("login", null, function(data) {
          if (err) {
            return handleError(err);
          }

          echo("login callback: " + JSON.stringify(data));
        });
      }
      echo(JSON.stringify(data));
    });
  },
  updateTitle: function() {
    NativeAPI.invoke("updateTitle", {
      text: "New Title"
    });
  },
  login: function() {
    NativeAPI.invoke("login", null, function(err, data) {
      if (err) {
        return handleError(err);
      }

      echo("login callback: " + JSON.stringify(data));
    });
  }
});

new AppView();
