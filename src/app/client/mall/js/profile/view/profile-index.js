// var $         = require("jquery");
var _         = require("lodash");
var Backbone  = require("backbone");
var UrlUtil   = require("com/mobile/lib/url/url.js");
var sendPost  = require("app/client/mall/js/lib/mall-request.js").sendPost;
var Promise   = require("com/mobile/lib/promise/npo.js");
var widget    = require("app/client/mall/js/lib/common.js");
var mallPromise = require("app/client/mall/js/lib/mall-promise.js");

var AppView = Backbone.View.extend({
  el: "#profile-index",
  initialize: function(commonData) {
    _.extend(this, commonData);
  },
  resume: function() {
  }
});

module.exports = AppView;
