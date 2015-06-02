var $          = require("jquery");
var NativeAPI  = require("app/client/common/lib/native/native-api.js");

exports.createAView = function(e) {
  e.preventDefault();
  
  var $cur = $(e.currentTarget);
  var url = $cur.prop("href");

  if ( $cur.data() ) {
    url = url.indexOf("?") >= 0 ? url : url + "?";
    url = url + $.param( $cur.data() );
  }

  exports.createNewView({
    url: url,
    title: $cur.data("title")
  });
};

exports.createNewView = function(options) {
  NativeAPI.invoke("createWebView", {
    url: options.url,
    controls: [
      {
        type: options.type || "title",
        text: options.title || ""
      }
    ]
  });
};
