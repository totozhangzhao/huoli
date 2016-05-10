import Backbone from "backbone";
import template from "app/client/mall/tpl/menu/promotion/baner.tpl";
var BannerView  = Backbone.View.extend({

  el: "#banner",

  events: {},

  template: template,

  initialize: function () {
  },

  render(data) {
    this.$el.html(this.template({data:data}));
  }
});
module.exports = BannerView;
