var Backbone  = require("backbone");
var NativeAPI = require("app/client/common/lib/native/native-api.js");
var echo      = require("app/client/test/common/native/util.js").echo;
var storage   = require("app/client/test/common/native/storage.js");
var $         = require("jquery");
var _         = require("lodash");

window.nInvoke = _.bind(NativeAPI.invoke, NativeAPI);

var AppView = Backbone.View.extend({
  el: "body",
  events: {
    "click .js-createWebView": "newPage",
    "click .js-js-back"      : "doJSBack",
    "click .js-close" : "doNativeClose",
    "click .js-closeAll"     : "doNativeCloseAll",
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
  newPage: function() {
    NativeAPI.invoke("createWebView", {
      url: window.location.origin + "/fe/app/client/test/common/native/native-b-1.html",
      controls: [
        {
          type: "title",
          text: "Native B ~"
        }
      ]
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
  doNativeCloseAll: function() {
    var backObj = {
      preventDefault: this.jsBackFlag
    };
    
    NativeAPI.registerHandler("back", function(params, callback) {
      callback(null, backObj);

      if (backObj.preventDefault) {      
        NativeAPI.invoke("closeAll");
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
