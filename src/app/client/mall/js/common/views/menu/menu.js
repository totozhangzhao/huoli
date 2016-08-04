import $ from "jquery";
import Backbone from "backbone";
import * as widget from "app/client/mall/js/lib/common.js";

const MenuView = Backbone.View.extend({
  tagName: "div",

  className: "home-bottom-nav flex-row",

  events: {
    "click .home-bottom-list" : "changeView"
  },

  template: require("app/client/mall/tpl/common/menu/menu.tpl"),

  initialize(options) {
    options = options || {};
    if(options.show) {
      this.render();
      this.selectView(options.viewName || '');
    }
  },

  render() {
    this.$el.html(this.template());
    return this;
  },

  selectView(viewName) {
    this.resetView();
    $("[data-menu='" + viewName + "']", this.$el).addClass('on');
  },

  resetView() {
    this.$el.find(".home-bottom-list").removeClass('on');
  },

  changeView(e) {
    if($(e.currentTarget).hasClass('on')) {
      e.preventDefault();
      return;
    }
    widget.createAView(e);
  }
});

export default MenuView;
