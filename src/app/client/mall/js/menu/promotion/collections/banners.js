var $             = require("jquery");
var Backbone      = require("backbone");
var _             = require("lodash");

var BannerItem = require("app/client/mall/js/menu/promotion/models/banner.js");

var Banners  = Backbone.Collection.extend({
  model: BannerItem
});

module.exports = Banners;
