"use strict";

var webpack = require("webpack");
var through = require('through2');
var gutil   = require("gulp-util");

module.exports = function(webpackConfig, options) {
  var lastFile = null;

  return through.obj(function (file, encoding, callback) {
    this.push(file);
    callback();
  }, function (callback) {
    if (options.build) {
      delete webpackConfig.devtool;

      webpackConfig.plugins.push(
        new webpack.optimize.UglifyJsPlugin({
          compress: {
            warnings: false
          },
          output: {
            comments: false
          }
        })
      );
    }
    
    var compiler = webpack(webpackConfig);

    compiler.run(function(err, stats) {
      if (err) {
        throw new gutil.PluginError("webpack", err);
      }
      
      gutil.log("[webpack]", stats.toString({
        reason: false
      }));

      return callback();
    });
  });
};
