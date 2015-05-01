var $        = require("jquery");
var Backbone = require("backbone");

exports.vertical = Backbone.View.extend({
  events: {
    "touchstart" : "touchstart",
    "touchmove"  : "touchmove",
    "touchcancel": "touchcancel",
    "touchend"   : "touchend",
    "click [data-role='scroll']": "cancelScroll"
  },
  initialize: function(config) {
    this.config = this.$el.data();
    this.pageY = 0;
    this.pageX = 0;
    this.current = 0; 
    this.swipe = config.swipe || "Y";
    this.gape = config.gape || 50;
    this.height;
    this.width;
    this.initPage();
  },
  cancelScroll: function(e) {
    e.preventDefault();
  },
  initPage: function(index) {
    var children = this.$el.find("[data-role='item']");

    this.limit  = this.config.limit || children.size();
    this.height = this.$el[0].clientHeight;
    this.width  = this.$el[0].clientWidth;

    var target = index ? children[index] : children[0];

    if (!$(target)) {
      return;
    }

    $(target).addClass("moving");
    this.transY($(target), 0);
    
    setTimeout(function() {
      $(target).removeClass("moving");
      $(target).addClass("active");
    }, 300);
  },
  touchstart: function(e) {
    var _e = e.originalEvent || e;
    var touch = _e.touches[0];
    this.pageY = touch.pageY;
    this.pageX = touch.pageX;
    this.flag = null;
    this.move = 0;
  },
  touchmove: function(e) {
    var _e = e.originalEvent || e;
    var touch = _e.touches[0];
    var curY = touch.pageY - this.pageY;
    var curX = touch.pageX - this.pageX;
    var $cur = this.getCurrent();
    var $preSibling = $cur.prev();
    var $nextSibling = $cur.next();
    var clientHeight = this.height;

    if (this.$el.hasClass("page-scroll")) {
      return;
    }
    if (this.current === 0 && curY > 0) {
      return;
    }
    if (this.current === this.limit - 1 && curY < 0) {
      return;
    }
    if (!this.flag) {
      this.flag = Math.abs(curX) > Math.abs(curY) ? "X" : "Y";
      if (this.flag === this.swipe) {
        $cur.addClass("moving");
        $preSibling.addClass("moving");
        $nextSibling.addClass("moving");
      }
    }
    if (this.flag === this.swipe) {
      e.preventDefault();
      e.stopPropagation();
      switch (this.swipe) {
        case "Y":
          this.move = curY;
          this.transY($cur, curY);
          console.log($preSibling[0]);
          console.log($nextSibling[0]);
          $preSibling[0] && this.transY($preSibling, curY - clientHeight);
          $nextSibling[0] && this.transY($nextSibling, curY + clientHeight);
          break;
      }
    }
  },
  touchend: function(e) {
    var move = this.move;
    var $cur = this.getCurrent();
    var $preSibling = $cur.prev();
    var $nextSibling = $cur.next();
    $cur.removeClass("moving");
    $preSibling[0] && $preSibling.removeClass("moving");
    $nextSibling[0] && $nextSibling.removeClass("moving");
    if (!this.flag) {
      return;
    }
    e.preventDefault();
    if (move < -this.gape && $nextSibling[0]) {
      return this.next();
    }
    if (move > this.gape && $preSibling[0]) {
      return this.pre();
    }

    this.reset();
  },
  touchcancel: function() {
    var $cur = this.getCurrent();
    var $preSibling = $cur.prev();
    var $nextSibling = $cur.next();
    $cur.removeClass("moving");
    $preSibling[0] && $preSibling.removeClass("moving");
    $nextSibling[0] && $nextSibling.removeClass("moving");
    this.reset();
  },
  reset: function() {
    var height = this.$el[0].clientHeight;
    var width = this.$el[0].clientWidth;
    var $cur = this.getCurrent();
    var $preSibling = $cur.prev();
    var $nextSibling = $cur.next();
    var dir = this.swipe;
    this.setCurrent($cur);

    $preSibling[0] && this["trans" + dir]($preSibling, -(dir === "Y" ? height : width));
    $nextSibling[0] && this["trans" + dir]($nextSibling, dir === "Y" ? height : width);
  },
  transY: function($el, y, speed) {
    if (!$el.length) {
      return;
    }

    var style = $el[0].style;

    style.webkitTransitionDuration =
      style.MozTransitionDuration =
      style.msTransitionDuration =
      style.OTransitionDuration =
      style.transitionDuration = (speed || 0) + "ms";

    style.webkitTransform = "translate(0, " + y + "px)" + "translateZ(0)";
    style.msTransform =
      style.MozTransform =
      style.OTransform = "transY(" + y + "px)";
  },
  setCurrent: function($cur, index) {
    this.transY($cur, 0);
    if (index) {
      this.current = index;
    }
  },
  getCurrent: function() {
    return this.$el.find("[data-role='item']").eq(this.current);
  },
  pre: function() {
    this.go(this.current - 1);
  },
  next: function() {
    this.go(this.current + 1);
  },
  go: function(target) {
    var $target = $(this.$el.children()[target]);
    var $cur = this.getCurrent();
    var tag = target < this.current ? -1 : 1;
    var clientHeight = this.$el[0].clientHeight;
    var clientWidth = this.$el[0].clientHeight;
    if (target === this.current || target < 0 || target >= this.limit) {
      return;
    }
    this.current = target;
    this["trans" + this.swipe]($cur, -tag * (this.swipe === "Y" ? clientHeight : clientWidth));
    this.setCurrent($target, target);
    this.finish($cur, $target);
  },
  finish: function($el, $target) {
    this.flag = null;
    $el && $el.removeClass("active");
    $target && $target.addClass("active");
  }
});