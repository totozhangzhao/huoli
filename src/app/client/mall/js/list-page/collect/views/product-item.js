// import $ from "jquery";
// import _ from "lodash";
import Backbone from "backbone";
import * as tplUtil from "app/client/mall/js/lib/mall-tpl.js";

// templates
import productListItemTpl from "app/client/mall/tpl/list-page/collect/product-list-item.tpl";
const OrderListView = Backbone.View.extend({

  tagName: "li",

  events: {

  },

  initialize() {
    this.listenTo(this.model, "change", this.render);
    this.listenTo(this.model, "destroy", this.remove);
  },

  render() {
    this.model.set({isRender: true});
    this.$el.html(productListItemTpl({
      productItem: this.model.toJSON(),
      tplUtil
    }));
    return this;
  }
});

export default OrderListView;
