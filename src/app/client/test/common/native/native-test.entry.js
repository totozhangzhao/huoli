var $           = require("jquery");
var _           = require("lodash");
var Backbone    = require("backbone");
var storage     = require("app/client/test/common/native/storage.js");
var NativeAPI   = require("app/client/common/lib/native/native-api.js");
var echo        = require("app/client/test/common/native/util.js").echo;
var handleError = require("app/client/test/common/native/util.js").handleError;
var loadScript  = require("com/mobile/lib/load-script/load-script.js");
var shareUtil   = require("com/mobile/widget/wechat/util.js");
var cookie      = require("com/mobile/lib/cookie/cookie.js");

// nInvoke("myFunc", {a: 1}, function(err, data) { console.log(err); console.log(data); });
window.nInvoke = _.bind(NativeAPI.invoke, NativeAPI);

var AppView = Backbone.View.extend({
  el: "body",
  events: {
    "click .js-appname-cookie"  : "showAppNameFromCookie",
    "click .js-native-back"     : "doNativeBack",
    "click .js-selectContact"   : "selectContact",
    "click .js-setOrientation"  : "setOrientation",
    "click .js-close"           : "doNativeClose",
    "click .js-native-back-text": "doNativeBackText",
    "click .js-createWebView"   : "newPage",
    "click .js-hashchange-page" : "newPageHash",
    "click .js-showUserAgent"   : "showUserAgent",
    "click .js-alert"           : "alert",
    "click .js-share"           : "share",
    "click .js-scanBarcode"     : "scanBarcode",
    "click .js-storage-set"     : "setStorage",
    "click .js-storage-get"     : "getStorage",
    "click .js-getDeviceInfo"   : "getDeviceInfo",
    "click .js-getUserInfo"     : "getUserInfo",
    "click .js-getHBUserInfo"   : "getHBUserInfo",
    "click .js-getGTUserInfo"   : "getUsGTerInfo",
    "click .js-updateTitle"     : "updateTitle",
    "click .js-login"           : "login",
    "click .js-getCurrentPosition"      : "getCurrentPosition",
    "click .js-updateHeaderRightBtnText": "rightButtonText",
    "click .js-updateHeaderRightBtnIcon": "rightButtonIcon",
    "click .js-goods-detail": "gotoGoods"
  },
  initialize: function() {
    this.jsBackFlag = false;

    NativeAPI.registerHandler("loginCompleted", function() {
      echo("JavaScript loginCompleted");
    });

    NativeAPI.registerHandler("resume", function() {
      echo("JavaScript resume");
    });

    $(window).on("hashchange", function() {
      echo("index page: " + window.location.hash);
    });

    if ( shareUtil.hasShareInfo() ) {
      loadScript(window.location.origin + "/fe/com/mobile/widget/wechat/wechat.bundle.js");
    }
  },
  gotoGoods: function() {
    var id = $("#goods-detail-input").val();

    if (id === "" || typeof id === "undefined" || id === null) {
      return;
    }

    var url = "/fe/app/client/mall/html/detail-page/goods-detail.html?productid=" + id;

    NativeAPI.invoke("createWebView", {
      url: url,
      controls: [
        {
          type: "title",
          text: "商品详情"
        }
      ]
    }, function(err) {
      if ( err && (err.code === -32603) ) {
        window.location.href = url;
      }
    });
  },
  showAppNameFromCookie: function() {
    echo( cookie.get("appName") );
  },
  selectContact: function() {
    var params = {
      maxNum: "0"
    };

    echo(JSON.stringify(params));

    NativeAPI.invoke("selectContact", params, function(err, data) {
      if (err) {
        return handleError(err);
      }

      echo(JSON.stringify(data));
    });
  },
  setOrientation: function() {

    // portrait（强制竖屏），默认
    // auto（跟随手机旋转）
    // landscape（强制横屏）
    var params = {
      orientation: "landscape"
    };

    echo(JSON.stringify(params));

    NativeAPI.invoke("setOrientation", params, function(err, data) {
      if (err) {
        return handleError(err);
      }

      echo(JSON.stringify(data));
    });
  },
  share: function() {

    // title
    // desc
    // link
    // imgUrl
    NativeAPI.invoke("sharePage", {
      title: "NativeAPI测试页",
      desc: "测试 Native 与 JavaScript 之间的接口",
      link: window.location.href,
      imgUrl: "http://cdn.rsscc.cn/guanggao/img/mall/h1-index-goods-envelope5.png"
    }, function(err, data) {
      if (err) {
        return handleError(err);
      }

      echo(JSON.stringify(data));
    });
  },
  scanBarcode: function() {
    NativeAPI.invoke("scanBarcode", null, function(err, data) {
      if (err) {
        return handleError(err);
      }

      echo(JSON.stringify(data));
    });
  },
  doNativeBack: function() {
    NativeAPI.invoke("back");
  },
  doNativeClose: function() {
    var backObj = {
      preventDefault: this.jsBackFlag
    };
    
    NativeAPI.registerHandler("back", function(params, callback) {
      callback(null, backObj);

      if (backObj.preventDefault) {      
        NativeAPI.invoke("close");
      }
    });

    echo(JSON.stringify(backObj));
    this.jsBackFlag = !this.jsBackFlag;
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
  rightButtonText: function() {
    var self = this;

    NativeAPI.invoke("updateHeaderRightBtn", {
      action: "show",
      text: "分享",
      data: {
        list: [1, 2, 3]
      }
    }, function(err, data) {
      if (err) {
        return handleError(err);
      }

      echo(JSON.stringify(data));
    });

    NativeAPI.registerHandler("headerRightBtnClick", function(data) {
      echo(JSON.stringify(data));
      self.share();
    });
  },
  rightButtonIcon: function() {
    var self = this;

    NativeAPI.invoke("updateHeaderRightBtn", {
      action: "show",
      icon: require("app/client/mall/image/share-icon.js"),
      text: "分享",
      data: {
        list: [1, 2, 3]
      }
    }, function(err, data) {
      if (err) {
        return handleError(err);
      }

      echo(JSON.stringify(data));
    });

    NativeAPI.registerHandler("headerRightBtnClick", function(data) {
      echo(JSON.stringify(data));
      self.share();
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
  newPageHash: function() {
    NativeAPI.invoke("createWebView", {
      url: window.location.origin + "/fe/app/client/test/common/native/native-hashchange.html",
      controls: [
        {
          type: "title",
          text: "Native hash"
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
    var params = {
      appName: "hbgj"
    };

    NativeAPI.invoke("getUserInfo", params, function(err, data) {
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
  getHBUserInfo: function() {
    var params = {
      appName: "hbgj"
    };

    NativeAPI.invoke("getUserInfo", params, function(err, data) {
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
  getGTUserInfo: function() {
    var params = {
      appName: "gtgj"
    };

    NativeAPI.invoke("getUserInfo", params, function(err, data) {
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
  },
  getCurrentPosition: function() {
    NativeAPI.invoke("getCurrentPosition", null, function(err, data) {
      if (err) {
        return handleError(err);
      }

      echo(JSON.stringify(data));
    });
  }
});

new AppView();
