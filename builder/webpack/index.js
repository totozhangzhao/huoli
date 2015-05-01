// PLUGIN_NAME: sample
var webpack = require("webpack");
var through = require('through-gulp');
var gutil   = require("gulp-util");

function sample() {
  var stream = through(function(file, encoding, callback) {
    var self = this;
    var compiler = webpack( require("../../webpack.config") );

    compiler.run(function(err, stats) {
      if (err) {
        throw new gutil.PluginError("webpack", err);
      }
      
      gutil.log("[webpack]", stats.toString({
        reason: false
      }));

      self.push(file);
      callback();
    });
  });

  return stream;
};

module.exports = sample;
