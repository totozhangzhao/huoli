// import $ from "jquery";
import Backbone from "backbone";
import * as tplUtil from "app/client/mall/js/lib/mall-tpl.js";

// views

// templates
import goodsItemTpl from "app/client/mall/tpl/list-page/category/goods-item.tpl";
const OrderListView = Backbone.View.extend({
  tagName: "li",

  events: {
  },

  initialize() {
    // this.listenTo(this.model, "destroy", this.remove);
    // this.listenTo(this.model, "change", this.render);
  },

  render() {
    this.$el.html(goodsItemTpl({
      tplUtil,
      goodsItem: this.model.toJSON()
    }));
    return this;
  }
});

export default OrderListView;
