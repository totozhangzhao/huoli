var $ = require("jquery");

exports.echo = function(text) {
  var $echo = $("#echo");

  $echo
    .css("opacity", 0)
    .text(String(text));

  setTimeout(function() {
    $echo.css("opacity", 1);
  }, 300);
};

exports.handleError = function(err) {
  if (err.code) {
    exports.echo("JSON-RPC Error [code:"+err.code+"]: " + err.message);
  } else {
    exports.echo(err.message);
  }
};
