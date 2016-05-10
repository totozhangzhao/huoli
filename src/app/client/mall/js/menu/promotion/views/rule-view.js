// var $        = require("jquery");
import Backbone from "backbone";
// var _        = require("lodash");
import template from "app/client/mall/tpl/menu/promotion/rules.tpl";

var BottomView  = Backbone.View.extend({

  el: "#bottom",

  template: template,

  events: {},

  initialize: function () {

  },

  render(data) {
    this.$el.html(this.template({data:data}));
  }
});
module.exports = BottomView;
