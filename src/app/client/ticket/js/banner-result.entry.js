var $         = require("jquery");
var parseUrl  = require("com/mobile/lib/url/url.js").parseUrlSearch;
var sendPost  = require("app/client/mall/js/lib/mall-request.js").sendPost;
var logger    = require("com/mobile/lib/log/log.js");

var urlData = parseUrl();

var showInsurancePage = function() {
  $("#insurance-banner").show();

  var $btn = $("#goto393");

  $btn.prop(
    "href",
    $btn.prop("href") + "&orderinfo=" + encodeURIComponent(urlData.orderinfo || "")
  );

  $("body").on("click", "[href]", function() {
    logger.track("insurance - Base64 URL", "click");
  });
};

if ( String(urlData.insurance) === "1" ) {
  var params = {
    pos: 1
  };

  sendPost("getAdvUrl", params, function(err, data) {
    window.location.href = data.url;
  });
} else {
  showInsurancePage();
}
