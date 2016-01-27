var $ = require("jquery");

exports.init = function(options) {
  if (!options.flag) {
    return;
  }

  var tmpl = require("app/client/mall/tpl/etc/warning.tpl");
  var $warning = $(tmpl({
    text: options.text
  }))
    .on("click", function() {
      $warning.remove();
    });

  return $warning;
};
