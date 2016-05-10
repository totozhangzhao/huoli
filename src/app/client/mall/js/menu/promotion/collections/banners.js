var Backbone      = require("backbone");

var BannerItem = require("app/client/mall/js/menu/promotion/models/banner.js");

var Banners  = Backbone.Collection.extend({
  model: BannerItem
});

module.exports = Banners;
