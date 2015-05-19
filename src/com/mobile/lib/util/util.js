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
