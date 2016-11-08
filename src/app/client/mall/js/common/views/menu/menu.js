
import $ from "jquery";
import Backbone from "backbone";
import * as mallUtil from "app/client/mall/js/lib/util.js";
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
    let url = this.getUrlByName($(e.currentTarget).data("menu"));
    widget.createNewView({ url});
  },

  replaceView(e) {
    e.preventDefault();
    if($(e.currentTarget).hasClass('on')) {
      return;
    }
    let url = this.getUrlByName($(e.currentTarget).data("menu"));
    widget.replacePage(url);
  },

  getUrlByName(name) {
    let url = "";
    let groupId = "10000308";
    if(mallUtil.isHangbanFunc()) {
      groupId = "22000111";
    }
    switch(name) {
      case "home":
        url = "/fe/app/client/mall/index.html";
        break;
      case "topic":
        url = `${tplUtil.getBlockUrl({action: 10})}?groupId=${groupId}&showMenu=true`;
        break;
      case "category":
        url = "/fe/app/client/mall/html/menu/category.html";
        break;
      case "my":
        url = "/fe/app/client/mall/html/profile/profile.html";
        break;
    }
    return url;
  }
});

export default MenuView;
