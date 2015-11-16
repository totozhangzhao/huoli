var webpack = require("webpack");
var path    = require("path");
var _       = require("lodash");

var pathList = require("./webpack-builder/entry-list.js");
var entry    = {};

pathList.forEach(function(devPath) {
  var key = "/" + devPath.replace(/\.entry\.js/, ".bundle");
  entry[key] = __dirname + "/src/" + devPath;
});

_.extend(entry, {
  "vendor": ["jquery", "lodash", "backbone"]
});

module.exports = {
  resolve: {
    root: __dirname + "/src",
    alias: {
      "jquery"    : __dirname + "/src/com/mobile/lib/jquery/jquery.js",
      "backbone"  : __dirname + "/src/com/mobile/lib/backbone/backbone.js",
      "async"     : __dirname + "/src/com/mobile/lib/async/async.js",
      "jsonrpc"   : __dirname + "/src/com/mobile/lib/jsonrpc/jsonrpc.js"
    }
  },
  entry: entry,
  // entry: {
  //   "vendor": ["jquery", "lodash", "backbone"],
  //   "/app/client/test/common/native/native-b.bundle": __dirname + "/src/app/client/test/common/native/native-b.entry.js",
  //   "/app/client/test/common/native/native-test.bundle": __dirname + "/src/app/client/test/common/native/native-test.entry.js"
  // },
  output: {
    path: path.join(__dirname, "dest"),
    filename: "[name].js"
  },
  module: {
    loaders: [
      { test: /\.tpl$/, loader: "tpl-loader" },
      { test: /\.css$/, loader: "style-loader!css-loader?minimize!autoprefixer-loader" }
    ]
  },
  plugins: [
    // add it in build task
    // new webpack.optimize.UglifyJsPlugin({
    //   output: {
    //     comments: false
    //   }
    // }),
    new webpack.optimize.CommonsChunkPlugin("vendor", "vendor/vendor-mvc.bundle.js")
  ],
  devtool: "source-map",
  useMemoryFs: true,
  progress: true
};
