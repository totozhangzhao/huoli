exports.parseUrlSearch = function() {
  var query = window.location.search.slice(1);
  var result = {};
  query.split("&").forEach(function(part) {
    var item = part.split("=");
    result[item[0]] = decodeURIComponent(item[1]);
  });
  return result;
};

exports.addTimestampToUrl = function(url) {
  var timestamp = new Date().getTime();

  if ( url.split("#")[1] ) {
    url = url.indexOf("&_t") !== -1 ?
        url.replace(/_t=\d*/, "_t=" + timestamp) :
        url + "&_t=" + timestamp;
  } else {
    url = url + "#&_t=" + timestamp;
  }

  return url;
};
