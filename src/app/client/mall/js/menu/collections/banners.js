var $           = require("jquery");
var Backbone    = require("backbone");
var BannerModel = require("app/client/mall/js/menu/models/banner.js");
var banners = Backbone.Collection.extend({
  model: BannerModel
});

module.exports = banners;