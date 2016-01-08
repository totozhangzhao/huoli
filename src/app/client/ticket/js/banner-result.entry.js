var $         = require("jquery");
var parseUrl  = require("com/mobile/lib/url/url.js").parseUrlSearch;
// var sendPost  = require("app/client/mall/js/lib/mall-request.js").sendPost;
var logger    = require("com/mobile/lib/log/log.js");

var urlData = parseUrl();

logger.track("insurance-main-PV", "View PV");

$("body").on("click", "[href]", function() {
  logger.track("insurance-main-click", "click");
});

// 买票时已经勾选过保险领取，就显示其他广告。
// 
// 页面 URL：
// https://mall.rsscc.cn/fe/app/client/ticket/html/banner-result.html
// 
// 跳转页面：
// https://mall.rsscc.cn/fe/app/client/ticket/html/banner-mall.html
var handleInsuraceUrl = function() {
  // var showInsurancePage = function() {
  //   $("#insurance-banner").show();

  //   var $btn = $("#goto393");

  //   $btn.prop(
  //     "href",
  //     $btn.prop("href") + "&orderinfo=" + encodeURIComponent(urlData.orderinfo || "")
  //   );
  // };

  if ( String(urlData.insurance) === "1" ) {
    // var params = {
    //   pos: 1
    // };

    // sendPost("getAdvUrl", params, function(err, data) {
    //   if (err) {
    //     showInsurancePage();
    //     return;
    //   }
    //   window.location.href = data.url;
    // });

    window.location.href = "https://mall.rsscc.cn/fe/app/client/ticket/html/banner-mall.html";
  } else {
    window.location.href = "https://mall.rsscc.cn/fe/app/client/ticket/html/banner-mall.html";
    // showInsurancePage();
  }
};

handleInsuraceUrl();
