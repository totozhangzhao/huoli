import _ from "lodash";
import Backbone from "backbone";
import ProductModel from "app/client/mall/js/list-page/collect/models/product.js";

var Products = Backbone.Collection.extend({
  model: ProductModel,

  /**
   * @param  {int} type - 显示类型  1 显示全部 2 仅显示有货
   * @return {[type]}
   */
  showOutOfStock(type) {
    this.forEach((item) => {
      if(type === 1) {
        item.set({visible: true});
      }else {
        if(!_.inRange( parseInt(item.get("status").code), 1, 3) && item.get('visible')) {
          item.set({visible: false});
        }
      }
    });
    return this;
  }
});

export default Products;
