var $        = require("jquery");
var mallUitl = require("app/client/mall/js/lib/util.js");

exports.blank = function(text) {
  var compiled = require("app/client/mall/tpl/etc/blank.tpl");
  return $(compiled({ text: text || "暂无信息" }));
};

exports.initial = function(message) {
  var $initial = $(".ui-initial");

  if ( $initial.length === 0 ) {
    var imgClass = "gt";
    var text = message || "正在加载…";

    if ( mallUitl.isHangbanFunc() ) {
      imgClass = "hb";
    }

    var compiled = require("app/client/mall/tpl/etc/initial.tpl");
    $initial = $(compiled({
      imgClass: imgClass,
      text: text
    }));

    $initial.hide().appendTo("body");
  }

  return $initial;
};
