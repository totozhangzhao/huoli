var $         = require("jquery");
var Backbone  = require("backbone");
var GoodsItem = require("app/client/mall/js/menu/models/goods-item.js");
var goods = Backbone.Collection.extend({
  model: GoodsItem
});

module.exports = goods;