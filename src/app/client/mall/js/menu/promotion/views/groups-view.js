import Backbone from "backbone";
import template from "app/client/mall/tpl/menu/promotion/groups.tpl";
import tplUtil from "app/client/mall/js/lib/mall-tpl.js";
const GroupView  = Backbone.View.extend({

  el: "#groups",

  events: {},

  template,

  initialize() {

  },

  render(groups) {
    this.$el.html(this.template({
      groups,
      tplUtil
    }));
  }
});

export default GroupView;
