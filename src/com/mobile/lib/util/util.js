var isType = function(type) {
  return function(obj) {
    return Object.prototype.toString.call(obj) === "[object " + type + "]";
  };
};

// different from underscore
// 
// 
// underscore:
// 
// _.isObject({});
// => true
// 
// _.isObject([1, 2, 3]);
// => true
// 
// 
// exports:
// 
// exports.isObject({});
// => true
// 
// exports.isObject([1, 2, 3]);
// => false
exports.isObject = isType("Object");
exports.isString = isType("String");
exports.isArray = Array.isArray || isType("Array");
exports.isFunction = isType("Function");
exports.isUndefined = isType("Undefined");

exports.getMobileSystem = function() {
  var ua = window.navigator.userAgent ||
            window.navigator.vendor ||
            window.navigator.opera;

  if ( (/iPhone|iPad|iPod/i).test(ua) ) {
    return "iOS";
  } else if ( (/Mac OS|Macintosh/i).test(ua) ) {
    return "iOS";
  } else if ( (/Android/i).test(ua) ) {
    return "Android";
  } else {
    return "Android";
  }
};
