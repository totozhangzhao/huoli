import Backbone from "backbone";
import GoodsModel from "app/client/mall/js/list-page/category/models/goods.js";
const GoodsCollection = Backbone.Collection.extend({
  model: GoodsModel,

  setFirstProduct(productId) {
    var first = this.findWhere({productid: parseInt(productId)});
    this.unshift(this.remove(first));
  }
});

module.exports = GoodsCollection;
