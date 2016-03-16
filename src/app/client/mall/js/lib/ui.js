var $ = require("jquery");

exports.blank = function(text) {
  var compiled = require("app/client/mall/tpl/etc/blank.tpl");
  return $(compiled({ text: text || "暂无信息" }));
};
