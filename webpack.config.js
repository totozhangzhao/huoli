var webpack = require("webpack");
var path    = require("path");
var _       = require("lodash");
var glob    = require("glob");

// /(\.\/src)(.*)(\.entry\.js)/.exec("./src/app/client/mall/js/index.entry.js")
// ["./src/app/client/mall/js/index.entry.js", "./src", "/app/client/mall/js/index", ".entry.js"]
var createEntryObj = function() {
  var entry = {};
  var entryKeys = function(path) {
    var matches = /(\.\/src)(.*)(\.entry\.js)/.exec(path);
    return matches[2] + ".bundle";
  };

  glob.sync("./src/**/*.entry.js").forEach(function(path) {
    entry[entryKeys(path)] = path;
  });
  
  _.extend(entry, {
    "vendor": ["jquery", "lodash", "backbone"]
  });

  return entry;
};

module.exports = {
  resolve: {
    root: __dirname + "/src",
    alias: {
      "backbone": "com/mobile/lib/backbone/backbone.js",
      "async"   : "com/mobile/lib/async/async.js",
      "jsonrpc" : "com/mobile/lib/jsonrpc/jsonrpc.js"
    }
  },
  // entry: {
  //   "vendor": ["jquery", "lodash", "backbone"],
  //   "/app/client/test/common/native/native-b.bundle": "./src/app/client/test/common/native/native-b.entry.js",
  //   "/app/client/test/common/native/native-test.bundle": "./src/app/client/test/common/native/native-test.entry.js"
  // },
  entry: createEntryObj(),
  output: {
    path: path.join(__dirname, "dest"),
    filename: "[name].js"
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: ["node_modules", __dirname + "/src/com/mobile/lib"],
        loader: "babel-loader",
        query: {
          compact: false,
          presets: ["es2015"]
        }
      },
      { test: /\.tpl$/, loader: "tpl-loader" },
      { test: /\.css$/, loader: "style-loader!css-loader?minimize!autoprefixer-loader" }
    ],
    preLoaders: [
      {
        test: /\.js$/,
        loader: "eslint-loader",
        exclude: ["node_modules", __dirname + "/src/com/mobile/lib"],
      }
    ]
  },
  eslint: {
    configFile: ".eslintrc",
    formatter: require("eslint-friendly-formatter")
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
