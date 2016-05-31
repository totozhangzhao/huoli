// var $        = require("jquery");
import Backbone from "backbone";
// var _        = require("lodash");
import template from "app/client/mall/tpl/menu/promotion/rules.tpl";

const BottomView  = Backbone.View.extend({

  el: "#bottom",

  template,

  events: {},

  initialize() {

  },

  render(data) {
    this.$el.html(this.template({data}));
  }
});
export default BottomView;
