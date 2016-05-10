// var $        = require("jquery");
import Backbone from "backbone";
// var _        = require("lodash");
//
import template from "app/client/mall/tpl/menu/promotion/groups.tpl";
import tplUtil from "app/client/mall/js/lib/mall-tpl.js";
var GroupView  = Backbone.View.extend({

  el: "#groups",

  events: {},

  template: template,

  initialize: function () {

  },

  render(groups) {
    groups.push(groups.slice(0)[0]);
    this.$el.html(this.template({
      groups: groups,
      tplUtil: tplUtil
    }));
  }
});

module.exports = GroupView;
