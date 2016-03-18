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
var notify         = require("gulp-notify");
var del            = require("del");
var runSequence    = require("run-sequence");
var webpackBuilder = require("./builder/webpack/index.js");
var versionRef     = require("./builder/version/version-ref.js");
var shell          = require("gulp-shell");
var md5            = require("gulp-md5-plus");
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
    // .pipe(versionRef())
    .pipe(gulp.dest(config.dest));
});

// Styles
gulp.task("styles", function() {
  return gulp.src(config.src + "**/*.css")
    .pipe(autoprefixer())
    .pipe(minifycss())
    // .pipe(versionRef())
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
    });
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

gulp.task("static", function() {
  runSequence(["html", "styles", "images"]);
});

// Clean
gulp.task("clean", function(cb) {
    del(config.dest, cb)
});

// Compress
gulp.task("compress", function() {
  return gulp.src("")
      .pipe(shell([
        "tar -cvzf ~/Downloads/dest-" + Date.now() + ".tgz ./dest",
        "open ~/Downloads/"
      ]));
});

gulp.task("dev", ["clean"], function () {
  runSequence("html", "styles", "images", "js");
});
gulp.task("build", ["clean"], function() {
  runSequence(["html", "styles", "images", "js"], ["md5:js", "md5:css"], "compress", "html");
});

// Watch
gulp.task("watch", function() {

  // HTML
  gulp.watch(config.src + "**/*.html", ["html"]);

  // CSS
  gulp.watch(config.src + "**/*.css", ["styles"]);

  // Images
  gulp.watch(config.src + "**/*.+(jpg|jpeg|png|gif)", ["images"]);

  // JavaScript
  gulp.watch(config.src + "**/*.js", ["js:lint"]);

});

// md5
gulp.task("md5:js", function (done) {
  gulp.src([config.dest + "{app,vendor}/**/*.js"], {base: config.dest})
  .pipe(md5(8, config.dest + "app/**/*.html"))
  .pipe(gulp.dest(config.dest))
  .on("end",done);
});
gulp.task("md5:css", function (done) {
  gulp.src(config.dest + "app/**/*.css", {base: config.dest})
  .pipe(md5(8, config.dest + "app/**/*.html"))
  .pipe(gulp.dest(config.dest))
  .on("end",done)
});

