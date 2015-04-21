var path = require("path");

module.exports = {
  resolve: {
    root: __dirname + "/src",
    alias: {
      "underscore" : __dirname + "/src/com/mobile/lib/underscore/underscore.js",
      "backbone"   : __dirname + "/src/com/mobile/lib/backbone/backbone.js",
      "jquery"     : __dirname + "/src/com/mobile/lib/jquery/jquery.js"
    }
  },
  entry: {
    "/com/mobile/widget/scratch-card/test/bundle.scratch-card": __dirname + "/src/com/mobile/widget/scratch-card/test/test.js",
    "/app/client/test/common/native/bundle.native-test": __dirname + "/src/app/client/test/common/native/native-test.js",
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
  useMemoryFs: true,
  progress: true
};
