var MultiLevel = require("com/mobile/widget/select/select.js").MultiLevel;
var sendPost   = require("app/client/mall/js/lib/mall-request.js").sendPost;
var province   = require("app/client/mall/data/region.js").province;
var $          = require("jquery");

MultiLevel.prototype.initSelect = function($select) {
  var self = this;
  $select.each(function(index, item) {
    if (index === 0) {
      self.addOption( $(item), province );
    } else {
      self.addOption( $(item) );
    }
  });
};

MultiLevel.prototype.getResult = function(options, callback) {
  var params = {
    id: options.id 
  };
  sendPost("getRegion", params, function(err, data) {
    callback(err, data);
  });
};

new MultiLevel({
  el: "#select-box"
});
