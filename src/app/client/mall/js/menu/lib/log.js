var mallUitl = require("app/client/mall/js/lib/util.js");
var logger   = require("com/mobile/lib/log/log.js");

exports.track = function(data) {
  var category = mallUitl.getAppName() + "-menu_" + data.title;
  logger.track(category, "View PV", data.from);
};
