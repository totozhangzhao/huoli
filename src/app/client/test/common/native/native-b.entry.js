var Backbone  = require("backbone");
var NativeAPI = require("app/client/common/lib/native/native-api.js");
var echo      = require("app/client/test/common/native/util.js").echo;

var AppView = Backbone.View.extend({
  el: "body",
  events: {
    "click .js-js-back": "doJSBack"
  },
  initialize: function() {
    this.jsBackFlag = false;
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
  }
});

new AppView();
