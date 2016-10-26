var $        = require("jquery");
var mallUtil = require("app/client/mall/js/lib/util.js");

var tmpl       = require("app/client/mall/tpl/etc/download-app.tpl");
var hangbanImg = "http://cdn.rsscc.cn/guanggao/app/app-d-hb.png";
var gaotieImg  = "http://cdn.rsscc.cn/guanggao/app/app-d-gt.png";
var isHangban  = mallUtil.isHangbanFunc();

// .css({ "-webkit-animation": "move 0.3s ease-out 0.5s forwards" })
// .css({ "animation": "move 0.3s ease-out 0.5s forwards" })
//
// 两种写法改变的都是 CSSStyleDeclaration 类型对象的 animation 属性的值
var $download = $(tmpl({
  img   : isHangban ? hangbanImg : gaotieImg,
  appUrl: isHangban ? mallUtil.getHangbanAppUrl() : mallUtil.getGaotieAppUrl()
}));

// @param  show : true 显示 false 不显示；
exports.init = function(isApp, show) {
  if( !show ){
    return;
  }
  if ( !isApp ) {
    $download.appendTo("body")
    .show()
    .css({ "animation": "move 0.3s ease-out 0.7s forwards" })
    .on("click", ".js-close", function() {
      $download.hide();
    });
  }
};
