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
var minifycss      = require("gulp-minify-css");
var jshint         = require("gulp-jshint");
var eslint         = require('gulp-eslint');
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

// eslint
gulp.task("es:lint", function() {
  return gulp.src(config.src + "**/*.js")
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError())
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
    del(config.dest, cb)
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
  runSequence(["html", "styles", "images", "js"], "rev:replace", "compress", "html");
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
  // gulp.watch(config.src + "**/*.js", ["js:lint"]);

});
