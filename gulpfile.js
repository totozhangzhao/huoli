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

var browserSync = require('browser-sync').create();

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
    .pipe(autoprefixer())
    .pipe(minifycss())
    .pipe(versionRef())
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

gulp.task("build", function() {
  runSequence("clean", ["html", "styles", "images", "js"], "compress");
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

gulp.task('dev', function() {
  browserSync.init({
    proxy: {
        target: "http://mall.rsscc.cn/fe/app/client/mall/",
        middleware: function (req, res, next) {
            console.log(req.url);
            next();
        }
    }
  });
    // HTML
  gulp.watch(config.src + "**/*.html", function () {
    runSequence("html", browserSync.reload)
  });

  // CSS
  gulp.watch(config.src + "**/*.css", function () {
    runSequence("styles", browserSync.stream)
  });

  // Images
  gulp.watch(config.src + "**/*.+(jpg|jpeg|png|gif)", function () {
    runSequence("images", browserSync.reload)
  });

  // JavaScript
  gulp.watch(config.src + "**/*.js", function () {
    runSequence("js:lint", browserSync.reload)
  });
});
