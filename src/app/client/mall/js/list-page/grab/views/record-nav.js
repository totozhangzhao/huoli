import $ from "jquery";
import Backbone from "backbone";

const GoodsListView = Backbone.View.extend({

  el: "#record-nav",

  events:{
    "click [data-route]": "route"
  },

  initialize() {

  },

  render() {

  },

  update(action) {
    $("[data-route]", this.$el).removeClass('on');
    $(`[data-route=${action}]`, this.$el).addClass('on');
  },

  route(e) {
    const data = $(e.currentTarget).data("route");
    this.switchTo(data, true, true);

  },

  switchTo(view, trigger, replace) {
    Backbone.history.navigate(view,{
      trigger: !!trigger,
      replace: !!replace
    });
  }
});
export default GoodsListView;
