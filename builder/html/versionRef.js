var through = require("through2");
var gutil = require("gulp-util");

module.exports = function(options) {

  function versionRef(file, encoding, callback) {
    if ( file.isNull() ) {
      return callback(null, file);
    }

    if ( file.isStream() ) {
      return callback(new gutil.PluginError("html-version-ref", "doesn\"t support Streams"));
    }

    var addVersion = file.contents.toString().replace(
      /(\.(js|css|png|jpg|jpeg))/g,
      function(match, $1) {
        var now = Date.now() / 1000;
        var expire = (options && options.expire) || 1;
        return ".__" + parseInt(now - (now % expire), 10) + "__" + $1;
      }
    );

    file.contents = new Buffer(addVersion);
    callback(null, file);
  }

  return through.obj(versionRef);
}
