var $       = require("jquery");
var $body = $("body");

if ( $body.find(".loading-box").length === 0 ) {
  var loadingTmpl = "" + 
      "<div class='loading-box'>" + 
        "<img src='https://dl.rsscc.cn/guanggao/img/mall/icon/loading.gif' class='loading-icon'>" +
      "</div>" +
      "";
  $body.append(loadingTmpl);
}

var $loading = $(".loading-box");

exports.showLoading = function() {
  $loading.show();
};

exports.hideLoading = function() {
  $loading.hide();
};

exports.toast = (function() {
  var $tip = $("<div class='toast'></div>").hide().appendTo("body");
  var hideTipTimer;
  return function(message, timeout) {
    if (message) {
      exports.hideLoading();
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