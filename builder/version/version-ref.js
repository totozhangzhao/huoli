var through = require("through2");
var gutil = require("gulp-util");

module.exports = function(options) {
  var now     = Date.now() / 1000;
  var expire  = (options && options.expire) || 1;
  var version = parseInt(now - (now % expire), 10);

  var versionRef = function(file, encoding, callback) {
    if ( file.isNull() ) {
      return callback(null, file);
    }

    if ( file.isStream() ) {
      return callback(new gutil.PluginError("html-version-ref", "doesn\"t support Streams"));
    }

    var regChangeFilename = /(\.(bundle.js|css))/g;
    // var regAddParam       = /(\.(png|jpg|jpeg|gif))/g;
    var fileContent       = file.contents.toString();

    if ( regChangeFilename.test(fileContent) ) {
      fileContent = fileContent.replace(
        regChangeFilename,
        function(match, $1) {
          return ".__" + version + "__" + $1;
        }
      );
    }

    // if ( regAddParam.test(fileContent) ) {
    //   fileContent = fileContent.replace(
    //     regAddParam,
    //     function(match, $1) {
    //       return $1 + "?_t=" + version;
    //     }
    //   );
    // }

    file.contents = new Buffer(fileContent);
    callback(null, file);
  };

  return through.obj(versionRef);
}
