"use strict";

var webpack = require("webpack");
var gutil   = require("gulp-util");

module.exports = function(webpackConfig, options, cb) {
  var hasCallback = false;

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
  } else if (options.watch) {
    webpackConfig.watch = options.watch;
  }

  var webpackChangeHandler = function(err, stats) {
    if (err) {
      throw new gutil.PluginError("webpack", err);
    }

    gutil.log("[webpack]", stats.toString({
      colors: true,
      hash: true,
      errors: true,
      errorDetails: true,
      reasons: false,
      children: false,
      source: false,
      warnings: false,
      publicPath: false,
      assets: false,
      version: false,
      modules: false,
      timings: false,
      chunks: false,
      chunkModules: false
    }));

    if (!hasCallback) {
      hasCallback = true;
      cb();
    }
  };

  return webpack(webpackConfig, webpackChangeHandler);
};
