var $ = require("jquery");

module.exports = (function() {
  var $tip = $("<div class='toast'></div>").hide().appendTo("body");
  var hideTipTimer;
  return function(message, timeout) {
    if (message) {
      $tip.html("<span>" + message + "</span>").show();
    }

    if (timeout) {
      clearTimeout(hideTipTimer);
      hideTipTimer = setTimeout(function() {
        $tip.hide();
      }, timeout);
    }

    return {
      setMessage: function(message, timeout) {
        timeout = (timeout !== void 0) ? timeout : 1500;

        $tip.html("<span>" + message + "</span>");
        if (timeout) {
          clearTimeout(hideTipTimer);
          hideTipTimer = setTimeout(function() {
            $tip.remove();
          }, timeout);
        }
      },
      remove: function() {
        $tip.remove();
      }
    };
  };
})();