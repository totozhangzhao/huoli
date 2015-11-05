// tianfangye.com

"use strict";

var initStore = function() {
  return Object.create(null);
};

var store = initStore();

var createEvent = function(fn, context, once) {
  return {
    fn: fn,
    context: context,
    once: once
  };
};

var EventEmitter = function() {};

EventEmitter.prototype._triggerEvent = function(evt, listeners, args) {
  var i, ev, len = listeners.length;
  var a1 = args[0], a2 = args[1], a3 = args[2], aLen = args.length;

  for (i = 0; i < len; i += 1) {
    if (listeners[i].once) {
      this.off(evt, listeners[i].fn);
    }
    switch (aLen) {
      case 0:
        (ev = listeners[i]).fn.call(ev.context);
        break;
      case 1:
        (ev = listeners[i]).fn.call(ev.context, a1);
        break;
      case 2:
        (ev = listeners[i]).fn.call(ev.context, a1, a2);
        break;
      case 3:
        (ev = listeners[i]).fn.call(ev.context, a1, a2, a3);
        break;
      default:
        (ev = listeners[i]).fn.apply(ev.context, args);
        break;
    }
  }
};

EventEmitter.prototype.emit = function(evt) {
  var fnList = store[evt];
  if ( !fnList ) {
    return;
  }
  var args = [];
  for (var i = 0, len = arguments.length - 1; i < len; i += 1) {
    args.push( arguments[i + 1] );
  }
  this._triggerEvent(evt, fnList, args);
  return this;
};

EventEmitter.prototype.on = function(evt, fn, context, once) {
  if ( store[evt] === void 0 ) {
    store[evt] = [];
  }
  store[evt].push(createEvent(fn, context || this, once));
  return this;
};

EventEmitter.prototype.once = function(evt, fn, context) {
  this.on(evt, fn, context, true);
  return this;
};

EventEmitter.prototype.off = function(evt, fn) {
  if ( !store[evt] ) {
    return this;
  }
  if (fn) {
    var listeners = store[evt];
    var newListeners = [];
    for (var i = 0, len = listeners.length; i < len; i += 1) {
      if (listeners[i].fn !== fn) {
        newListeners.push(listeners[i]);
      }
    }
    store[evt] = newListeners;
  } else {
    delete store[evt];
  }
  return this;
};

EventEmitter.prototype.offAll = function(evt) {
  if (evt) {
    delete store[evt];
  } else {
    store = initStore();
  }
  return this;
};

module.exports = EventEmitter;
