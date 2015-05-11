/**
 *
 * gulp
 *
 * webpack
 *
 */

// Load plugins
var gulp           = require("gulp");
var autoprefixer   = require("gulp-autoprefixer");
var minifyHTML     = require("gulp-minify-html");
var minifycss      = require("gulp-minify-css");
var jshint         = require("gulp-jshint");
var uglify         = require("gulp-uglify");
var notify         = require("gulp-notify");
var del            = require("del");
var runSequence    = require("run-sequence");
var gutil          = require("gulp-util");
var webpackBuilder = require("./builder/webpack/index.js");
var versionRef     = require("./builder/html/versionRef.js");

var config = {
  src : "./src/",
  dest: "./dest/"
};

// HTML
gulp.task("html", function() {

  // empty - do not remove empty attributes
  // cdata - do not strip CDATA from scripts
  // comments - do not remove comments
  // conditionals - do not remove conditional internet explorer comments
  // spare - do not remove redundant attributes
  // quotes - do not remove arbitrary quotes
  // loose - preserve one whitespace
  var options = {
    empty : true,
    cdata : true,
    spare : true,
    quotes: true
  };

  return gulp.src(config.src + "**/*.html")
    .pipe(minifyHTML(options))
    .pipe(versionRef())
    .pipe(gulp.dest(config.dest));
});

// Styles
gulp.task("styles", function() {
  return gulp.src(config.src + "**/*.css")
    .pipe(autoprefixer({ browsers: ["last 2 version"] }))
    .pipe(minifycss())
    .pipe(gulp.dest(config.dest))
});

// Images
gulp.task("images", function() {
  return gulp.src(config.src + "**/*.+(jpg|jpeg|png|gif)")
    .pipe(gulp.dest(config.dest));
});

// Scripts
gulp.task("js:lint", function() {
  return gulp.src(config.src + "**/*.js")
    .pipe(jshint(".jshintrc"))
    .pipe(jshint.reporter("jshint-stylish"))
    .pipe(jshint.reporter("fail"))
    .on("error", function(err) {
      this.emit("end");
    })
    // .pipe(uglify())
    // .pipe(gulp.dest(config.dest))
    // .pipe(notify({ message: "Scripts task complete!" }));
});

gulp.task("js:bundle", function() {
  return gulp.src("")
    .pipe(webpackBuilder(require("./webpack.config"), {
      build: true
    }));
});

gulp.task("js", function() {
  runSequence("js:lint", "js:bundle");
});

// Clean
gulp.task("clean", function(cb) {
    del(config.dest, cb)
});

gulp.task("build", function() {
  runSequence("clean", ["html", "styles", "images", "js"]);
});

// Watch
gulp.task("watch", function() {

  // HTML
  gulp.watch(config.src + "**/*.html", ["html"]);

  // CSS
  gulp.watch(config.src + "**/*.css", ["styles"]);

  // Images
  gulp.watch(config.src + "**/*.css", ["images"]);

  // JavaScript
  gulp.watch(config.src + "**/*.js", ["js:lint"]);

});
