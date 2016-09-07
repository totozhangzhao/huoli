/**
 *
 * gulp
 *
 * webpack
 *
 */

var gulp           = require("gulp");
var autoprefixer   = require("gulp-autoprefixer");
var minifyHTML     = require("gulp-minify-html");
var cleanCSS       = require('gulp-clean-css');
var notify         = require("gulp-notify");
var del            = require("del");
var runSequence    = require("run-sequence");
var webpackBuilder = require("./builder/webpack/index.js");
var versionRef     = require("./builder/version/version-ref.js");
var shell          = require("gulp-shell");
var rev            = require("gulp-rev");
var revReplace     = require("gulp-rev-replace");

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
    .pipe(cleanCSS())
    // .pipe(versionRef())
    .pipe(gulp.dest(config.dest))
});

// Images
gulp.task("images", function() {
  return gulp.src(config.src + "**/*.+(jpg|jpeg|png|gif)")
    .pipe(gulp.dest(config.dest));
});

gulp.task("js:bundle", function() {
  return gulp.src("")
    .pipe(webpackBuilder(require("./webpack.config"), {
      build: true
    }));
});

gulp.task("rev", function (cb) {
  return gulp.src([config.dest + "**/*.bundle.js", config.dest + "**/*.css"])
    .pipe(rev())
    .pipe(gulp.dest(config.dest))
    .pipe(rev.manifest())
    .pipe(gulp.dest(config.dest));
});

gulp.task("rev:replace", ["rev"], function () {
  var manifest = gulp.src(config.dest + "rev-manifest.json");
  return gulp.src(config.dest + "**/*.html")
    .pipe(revReplace({
      manifest: manifest
    }))
    .pipe(gulp.dest(config.dest));
});

// Clean
gulp.task("clean", function(cb) {
  del([config.dest])
    .then(function() {
      cb();
    });
});

// Compress
gulp.task("compress", function() {
  return gulp.src("")
    .pipe(shell([
      "tar -cvzf ~/Downloads/dest-" + Date.now() + ".tgz " + config.dest,
      "open ~/Downloads/"
    ]));
});

gulp.task("static", function() {
  runSequence(["html", "styles", "images"]);
});

gulp.task("build", ["clean"], function() {
  runSequence(["html", "styles", "images", "js:bundle"], "rev:replace", "compress", "html");
});

// Watch
gulp.task("watch", function() {

  // HTML
  gulp.watch(config.src + "**/*.html", ["html"]);

  // CSS
  gulp.watch(config.src + "**/*.css", ["styles"]);

  // Images
  gulp.watch(config.src + "**/*.+(jpg|jpeg|png|gif)", ["images"]);
});
