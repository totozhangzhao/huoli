import Backbone from "backbone";
import GoodsModel from "app/client/mall/js/list-page/category/models/goods.js";
const GoodsCollection = Backbone.Collection.extend({
  model: GoodsModel
});

module.exports = GoodsCollection;
