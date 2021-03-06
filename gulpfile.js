/**
 *
 * gulp
 *
 * webpack
 *
 */

var gulp           = require("gulp");
var minifyHTML     = require("gulp-minify-html");
var postcss        = require("gulp-postcss");
var autoprefixer   = require("autoprefixer");
var cssnano        = require("cssnano");
var del            = require("del");
var runSequence    = require("run-sequence");
var webpackBuilder = require("./builder/webpack/build.js");
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
  var processors = [
    autoprefixer(),
    cssnano()
  ];
  return gulp.src(config.src + "**/*.css")
    .pipe(postcss(processors))
    // .pipe(versionRef())
    .pipe(gulp.dest(config.dest))
});

// Images
gulp.task("images", function() {
  return gulp.src(config.src + "**/*.+(jpg|jpeg|png|gif)")
    .pipe(gulp.dest(config.dest));
});

gulp.task("js:watch", function(cb) {
  return webpackBuilder(require("./webpack.config"), {
    watch: true
  }, cb);
});

gulp.task("js:bundle", function(cb) {
  return webpackBuilder(require("./webpack.config"), {
    build: true
  }, cb);
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
      "tar -czf ~/Downloads/dest-" + Date.now() + ".tgz " + config.dest,
      "open ~/Downloads/"
    ]));
});

gulp.task("static", function() {
  runSequence(["html", "styles", "images"]);
});

gulp.task("build", ["clean"], function() {
  runSequence(["html", "styles", "images", "js:bundle"], "rev:replace", "compress", "html");
});

// Watch Static
gulp.task("ws", function() {

  // HTML
  gulp.watch(config.src + "**/*.html", ["html"]);

  // CSS
  gulp.watch(config.src + "**/*.css", ["styles"]);

  // Images
  gulp.watch(config.src + "**/*.+(jpg|jpeg|png|gif)", ["images"]);
});

// Watch
gulp.task("watch", ["ws", "js:watch"]);
