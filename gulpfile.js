/**
 *
 * gulp
 *
 * webpack
 *
 */

// Load plugins
var gulp         = require("gulp");
var autoprefixer = require("gulp-autoprefixer");
var minifycss    = require("gulp-minify-css");
var jshint       = require("gulp-jshint");
var uglify       = require("gulp-uglify");
var notify       = require("gulp-notify");
var del          = require("del");
var runSequence  = require('run-sequence');
var gutil        = require("gulp-util");
var webpack      = require('webpack');

var config = {
  src : "./src/",
  dest: "./dest/"
};

// HTML
gulp.task("html", function() {
  return gulp.src(config.src + "**/*.html")
    .pipe(gulp.dest(config.dest))
});

// Styles
gulp.task("styles", function() {
  return gulp.src(config.src + "**/*.css")
    .pipe(autoprefixer({ browsers: ["last 2 version"] }))
    .pipe(minifycss())
    .pipe(gulp.dest(config.dest))
    // .pipe(notify({ message: "Styles task complete" }));
});

// Scripts
gulp.task("js:lint", function() {
  return gulp.src(config.src + "**/*.js")
    .pipe(jshint(".jshintrc"))
    // .pipe(jshint.reporter("default"))
    .pipe(jshint.reporter("jshint-stylish"))
    .pipe(jshint.reporter("fail"))
    .on("error", function(err) {
      this.emit('end');
    })
    // .pipe(uglify())
    // .pipe(gulp.dest(config.dest))
    // .pipe(notify({ message: "Scripts task complete" }));
});

// Webpack
gulp.task("js:bundle", function(callback) {
  var compiler = webpack( require("./webpack.config") );

  compiler.run(function(err, stats) {
    if (err) {
      throw new gutil.PluginError("webpack", err);
    }
    
    gutil.log("[webpack]", stats.toString({
      reason: false
    }));

    callback();
  });
});

gulp.task("js", function() {
  runSequence("js:lint", "js:bundle");
});

// Clean
gulp.task("clean", function(cb) {
    del(config.dest, cb)
});

gulp.task("build", function() {
  runSequence(["html", "styles", "js"]);
});

// Watch
gulp.task("watch", function() {

  // HTML
  gulp.watch(config.src + "**.*.html", ["html"]);

  // Watch .css files
  gulp.watch(config.src + "**/*.css", ["styles"]);

  // Watch .js files
  gulp.watch(config.src + "**/*.js", ["js"]);

});