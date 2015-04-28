var $ = require("jquery");

var BasicRequest = function(config) {
  this.config = config;
};

BasicRequest.prototype.request = function(type, headers, query, data, callback) {
  var defer = $.Deferred();
  var config = this.config;

  if (typeof data === "function") {
    callback = data;
    data = void 0;
  }

  if (callback) {
    defer
      .done(function(result) {
        callback(null, result);
      })
      .fail(function(err) {
        callback(err);
      });
  }

  $.ajax({
    type: type,
    url: config.url + (query || ""),
    data: data,
    dataType: "text",
    headers: headers
  })
    .done(function(data) {
      defer.resolve(data);
    })
    .fail(function(err) {
      defer.reject(err);
    });

  return defer.promise();
};

exports.BasicRequest = BasicRequest;
