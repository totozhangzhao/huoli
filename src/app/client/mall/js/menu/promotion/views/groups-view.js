import Backbone from "backbone";
import template from "app/client/mall/tpl/menu/promotion/groups.tpl";
import tplUtil from "app/client/mall/js/lib/mall-tpl.js";
var GroupView  = Backbone.View.extend({

  el: "#groups",

  events: {},

  template: template,

  initialize: function () {

  },

  render(groups) {
    this.$el.html(this.template({
      groups: groups,
      tplUtil: tplUtil
    }));
  }
});

module.exports = GroupView;
