var $ = require("jquery");

exports.init = function(text) {
  var tmpl = require("app/client/mall/tpl/etc/warning.tpl");
  var $warning = $(tmpl({
    text: text
  }))
    .on("click", function() {
      $warning.remove();
    });

  return $warning;
};
