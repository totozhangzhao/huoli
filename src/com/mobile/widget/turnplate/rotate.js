var $ = require("jquery");

//
// JQueryRotate
//
// https://github.com/wilq32/jqueryrotate
//

// Library agnostic interface
var Wilq32 = {};

Wilq32.PhotoEffect = function(img, parameters) {
  img.Wilq32 = {
    PhotoEffect: this
  };

  this._img = this._rootObj = this._eventObj = img;
  this._handleRotation(parameters);
};

Wilq32.PhotoEffect.prototype = {
  _setupParameters: function(parameters) {
    this._parameters = this._parameters || {};
    if (typeof this._angle !== "number") {
      this._angle = 0;
    }
    if (typeof parameters.angle === "number") {
      this._angle = parameters.angle;
    }
    this._parameters.animateTo = (typeof parameters.animateTo === "number") ? (parameters.animateTo) : (this._angle);

    this._parameters.step = parameters.step || this._parameters.step || null;
    this._parameters.easing = parameters.easing || this._parameters.easing || function(x, t, b, c, d) {
      return -c * ((t = t / d - 1) * t * t * t - 1) + b;
    };
    this._parameters.duration = parameters.duration || this._parameters.duration || 1000;
    this._parameters.callback = parameters.callback || this._parameters.callback || function() {};
    if (parameters.bind && parameters.bind !== this._parameters.bind) {
      this._BindEvents(parameters.bind);
    }
  },
  _handleRotation: function(parameters) {
    this._setupParameters(parameters);
    if (this._angle === this._parameters.animateTo) {
      this._rotate(this._angle);
    } else {
      this._animateStart();
    }
  },

  _BindEvents: function(events) {
    if (events && this._eventObj) {
      // Unbinding previous Events
      if (this._parameters.bind) {
        var oldEvents = this._parameters.bind;
        for (var a in oldEvents) {
          if (oldEvents.hasOwnProperty(a)) {
            this._eventObj.removeEventListener(a, oldEvents[a], false);
          }
        }
      }

      this._parameters.bind = events;
      for (var a in events) {
        if (events.hasOwnProperty(a)) {
          this._eventObj.addEventListener(a, events[a], false);
        }
      }
    }
  },

  _Loader: function(parameters) {
    this._rootObj.setAttribute("id", this._img.getAttribute("id"));
    this._rootObj.className = this._img.className;

    this._width = this._img.width;
    this._height = this._img.height;
    this._widthHalf = this._width / 2; // used for optimisation
    this._heightHalf = this._height / 2; // used for optimisation

    var _widthMax = Math.sqrt((this._height) * (this._height) + (this._width) * (this._width));

    this._widthAdd = _widthMax - this._width;
    this._heightAdd = _widthMax - this._height; // widthMax because maxWidth=maxHeight
    this._widthAddHalf = this._widthAdd / 2; // used for optimisation
    this._heightAddHalf = this._heightAdd / 2; // used for optimisation

    this._img.parentNode.removeChild(this._img);

    this._aspectW = ((parseInt(this._img.style.width, 10)) || this._width) / this._img.width;
    this._aspectH = ((parseInt(this._img.style.height, 10)) || this._height) / this._img.height;

    this._canvas = document.createElement("canvas");
    this._canvas.setAttribute("width", this._width);
    this._canvas.style.position = "relative";
    this._canvas.style.left = -this._widthAddHalf + "px";
    this._canvas.style.top = -this._heightAddHalf + "px";
    this._canvas.Wilq32 = this._rootObj.Wilq32;

    this._rootObj.appendChild(this._canvas);
    this._rootObj.style.width = this._width + "px";
    this._rootObj.style.height = this._height + "px";
    this._eventObj = this._canvas;

    this._cnv = this._canvas.getContext("2d");
    this._handleRotation(parameters);
  },

  _animateStart: function() {
    if (this._timer) {
      clearTimeout(this._timer);
    }
    this._animateStartTime = new Date().getTime();
    this._animateStartAngle = this._angle;
    this._animate();
  },
  _animate: function() {
    var actualTime = new Date().getTime();
    var checkEnd = actualTime - this._animateStartTime > this._parameters.duration;

    // TODO: Bug for animatedGif for static rotation ? (to test)
    if (checkEnd && !this._parameters.animatedGif) {
      clearTimeout(this._timer);
    } else {
      if (this._canvas || this._img) {
        var angle = this._parameters.easing(0, actualTime - this._animateStartTime, this._animateStartAngle, this._parameters.animateTo - this._animateStartAngle, this._parameters.duration);
        this._rotate( (parseInt(angle * 10)) / 10 );
      }
      if (this._parameters.step) {
        this._parameters.step(this._angle);
      }
      var self = this;
      this._timer = setTimeout(function() {
        self._animate.call(self);
      }, 10);
    }

    // To fix Bug that prevents using recursive function in callback I moved this function to back
    if (this._parameters.callback && checkEnd) {
      this._angle = this._parameters.animateTo;
      this._rotate(this._angle);
      this._parameters.callback.call(this._rootObj);
    }
  },

  _rotate: function(angle) {
    this._angle = angle;
    this._img.style.WebkitTransform = "rotate(" + (angle % 360) + "deg)";
  }
};

$.fn.extend({
  rotate: function(parameters) {
    if (this.length === 0 || typeof parameters === "undefined") {
      return;
    }

    if (typeof parameters === "number") {
      parameters = {
        angle: parameters
      };
    }

    var returned = [];
    for (var i = 0, i0 = this.length; i < i0; i++) {
      var element = this.get(i);
      var paramClone = $.extend(true, {}, parameters);
      var newRotObject = new Wilq32.PhotoEffect(element, paramClone)._rootObj;

      returned.push($(newRotObject));
    }
    return returned;
  },
  getRotateAngle: function() {
    var ret = [];
    for (var i = 0, i0 = this.length; i < i0; i++) {
      var element = this.get(i);
      if (element.Wilq32 && element.Wilq32.PhotoEffect) {
        ret[i] = element.Wilq32.PhotoEffect._angle;
      }
    }
    return ret;
  },
  stopRotate: function() {
    for (var i = 0, i0 = this.length; i < i0; i++) {
      var element = this.get(i);
      if (element.Wilq32 && element.Wilq32.PhotoEffect) {
        clearTimeout(element.Wilq32.PhotoEffect._timer);
      }
    }
  }
});
