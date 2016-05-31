import Backbone from "backbone";
import template from "app/client/mall/tpl/menu/promotion/baner.tpl";
const BannerView  = Backbone.View.extend({

  el: "#banner",

  events: {},

  template,

  initialize() {
  },

  render(data) {
    this.$el.html(this.template({data}));
  }
});
export default BannerView;
