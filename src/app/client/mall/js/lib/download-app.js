var $        = require("jquery");
var mallUitl = require("app/client/mall/js/lib/util.js");

var tmpl       = require("app/client/mall/tpl/etc/download-app.tpl");
var hangbanImg = "http://cdn.rsscc.cn/guanggao/app/app-d-hb.png";
var gaotieImg  = "http://cdn.rsscc.cn/guanggao/app/app-d-gt.png";
var isHangban  = mallUitl.isHangbanFunc();

var $download = $(tmpl({
  img   : isHangban ? hangbanImg : gaotieImg,
  appUrl: isHangban ? mallUitl.getHangbanAppUrl() : mallUitl.getGaotieAppUrl()
}))
  .appendTo("body")
  .show()
  .css({
    "-webkit-animation": "move 0.3s ease-out 0.5s forwards",
    "animation": "move 0.3s ease-out 0.5s forwards"
  })
  .on("click", ".js-close", function() {
    $download.hide();
  });

exports.init = function(isApp) {
  if ( !isApp ) {
    $download.show();
  }
};
