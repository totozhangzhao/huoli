var webpack = require("webpack");
var path    = require("path");

module.exports = {
  resolve: {
    root: __dirname + "/src",
    alias: {
      "jquery"    : __dirname + "/src/com/mobile/lib/jquery/jquery.js",
      "underscore": __dirname + "/src/com/mobile/lib/underscore/underscore.js",
      "backbone"  : __dirname + "/src/com/mobile/lib/backbone/backbone.js",
      "jsonrpc"   : __dirname + "/src/com/mobile/lib/jsonrpc/jsonrpc.js"
    }
  },
  entry: {
    "vendor": ["jquery", "underscore", "backbone"],
    "/com/mobile/widget/banner/test/main.bundle": __dirname + "/src/com/mobile/widget/banner/test/main.entry.js",
    "/com/mobile/widget/swiper-full-page/test/main.bundle": __dirname + "/src/com/mobile/widget/swiper-full-page/test/main.entry.js",
    "/com/mobile/widget/scratch-card/test/scratch-card.bundle": __dirname + "/src/com/mobile/widget/scratch-card/test/scratch-card.entry.js",
    "/com/mobile/widget/swipe-page/test/swipe-page.bundle": __dirname + "/src/com/mobile/widget/swipe-page/test/swipe-page.entry.js",
    "/app/client/test/common/jsonrpc/jsonrpc-test.bundle": __dirname + "/src/app/client/test/common/jsonrpc/jsonrpc-test.entry.js",
    "/app/client/test/common/native/native-test.bundle": __dirname + "/src/app/client/test/common/native/native-test.entry.js"
  },
  output: {
    // publicPath: "./build/",
    // filename: "bundle.js"
    // path: "dest",
    // filename: '[name].js'
    path: path.join(__dirname, "dest"),
    filename: "[name].js"
  },
  module: {
    loaders: [
      { test: /\.css$/, loader: "style!css" }
    ]
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      output: {
        comments: false
      }
    }),
    new webpack.optimize.CommonsChunkPlugin("vendor", "vendor/vendor-jq.js")
  ],
  devtool: "source-map",
  useMemoryFs: true,
  progress: true
};
