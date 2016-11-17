
import $ from "jquery";
import Backbone from "backbone";
import * as widget from "app/client/mall/js/lib/common.js";
import * as tplUtil from "app/client/mall/js/lib/mall-tpl.js";

const MenuView = Backbone.View.extend({
  tagName: "div",

  className: "home-bottom-nav flex-row",

  events: {
    "click .js-new-view" : "changeView",
    "click .js-replace-view"  : "replaceView"
  },

  template: require("app/client/mall/tpl/common/menu/menu.tpl"),

  /*
    @param options[viewName]: home, category, my;
   */
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
    e.preventDefault();
    if($(e.currentTarget).hasClass('on')) {
      return;
    }
    let url = tplUtil.getBottomMenuUrl($(e.currentTarget).data("menu"));
    widget.createNewView({ url});
  },

  replaceView(e) {
    e.preventDefault();
    if($(e.currentTarget).hasClass('on')) {
      return;
    }
    let url = tplUtil.getBottomMenuUrl($(e.currentTarget).data("menu"));
    widget.replacePage(url);
  }
});

export default MenuView;
