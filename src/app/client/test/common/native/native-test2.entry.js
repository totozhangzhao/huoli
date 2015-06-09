var Backbone  = require("backbone");
var NativeAPI = require("app/client/common/lib/native/native-api.js");
var echo      = require("app/client/test/common/native/util.js").echo;
var storage   = require("app/client/test/common/native/storage.js");
var $         = require("jquery");

var AppView = Backbone.View.extend({
  el: "body",
  events: {
    "click .js-js-back": "doJSBack",
    "click .js-native-close" : "doNativeClose",
    "click .js-js-back-hashchange": "doJSBackHashchange",
    "click .js-hashchange"   : "changeHash",
    "click .js-storage-set"  : "setStorage",
    "click .js-storage-get"  : "getStorage"
  },
  initialize: function() {
    this.jsBackFlag = false;

    $(window).on("hashchange", function() {
      echo(window.location.hash);
    });
  },
  doJSBack: function() {
    var backObj = {
      preventDefault: this.jsBackFlag
    };
    
    NativeAPI.registerHandler("back", function(params, callback) {
      callback(null, backObj);

      if (backObj.preventDefault) {      
        NativeAPI.invoke("webViewCallback", {
          url: window.location.origin + "/fe/app/client/test/common/native/native-c.html"
        });
      }
    });

    echo(JSON.stringify(backObj));
    this.jsBackFlag = !this.jsBackFlag;
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
  doJSBackHashchange: function() {
    var backObj = {
      preventDefault: this.jsBackFlag
    };
    
    NativeAPI.registerHandler("back", function(params, callback) {
      callback(null, backObj);

      if (backObj.preventDefault) {      
        NativeAPI.invoke("webViewCallback", {
          url: window.location.origin +
            "/fe/app/client/test/common/native/index.html" +
            "#_t=" + (new Date().getTime())
        });
      }
    });

    echo(JSON.stringify(backObj));
    this.jsBackFlag = !this.jsBackFlag;
  },
  changeHash: function() {
    window.location.hash = "_t=" + (new Date().getTime());
  },
  setStorage: function() {
    var data = {
      name: "micro"
    };

    storage.set("test", data, function() {
      echo("storage set test");
    });
  },
  getStorage: function() {
    storage.get("test", function(data) {
      echo(JSON.stringify(data));
    });
  }
});

new AppView();
