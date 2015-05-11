var Backbone  = require("backbone");
var storage   = require("app/client/test/common/native/storage.js");
var NativeAPI = require("app/client/common/lib/native/native-api.js");
var $         = require("jquery");

var echo = function(text) {
  $("#echo")
    .hide()
    .text(text)
    .fadeIn();
};

var handleError = function(err) {
  echo("出错了！[code:" + err.code + "]: " + err.message);
};

var AppView = Backbone.View.extend({
  el: "body",
  events: {
    "click .js-js-back"      : "doJSBack",
    "click .js-native-back"  : "doNativeBack",
    "click .js-showUserAgent": "showUserAgent",
    "click .js-alert"        : "alert",
    "click .js-storage-set"  : "setStorage",
    "click .js-storage-get"  : "getStorage",
    "click .js-getDeviceInfo": "getDeviceInfo",
    "click .js-getUserInfo"  : "getUserInfo",
    "click .js-login"        : "login"
  },
  initialize: function() {
    this.jsBackFlag = false;

    NativeAPI.registerHandler("loginCompleted", function() {
      echo("JavaScript loginCompleted");
    });
  },
  doJSBack: function() {
    var backObj = {
      preventDefault: this.jsBackFlag
    };
    
    NativeAPI.registerHandler("back", function(params, callback) {
      callback(null, backObj);

      NativeAPI.invoke('webViewCallback', {
        url: "http://mall.rsscc.cn/fe/app/client/test/common/native/index.html?auth=true"
      });
    });

    echo(JSON.stringify(backObj));
    this.jsBackFlag = !this.jsBackFlag;
  },
  doNativeBack: function() {
    NativeAPI.invoke("back");
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