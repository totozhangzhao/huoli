var $ = require("jquery");

exports.echo = function(text) {
  $("#echo")
    .hide()
    .text(text)
    .fadeIn();
};

exports.handleError = function(err) {
  if (err.code) {
    exports.echo("JSON-RPC Error [code:"+err.code+"]: " + err.message);
  } else {
    exports.echo(err.message);
  }
};
