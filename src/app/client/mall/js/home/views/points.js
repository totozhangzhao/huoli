/*
  首页推广位视图
*/
import $ from "jquery";
import Backbone from "backbone";
const PointsView = Backbone.View.extend({

  el: "#home-points",

  initialize() {},

  render(data) {
    $(".num-font", this.$el).html(data.points)
    .end()
    .show();
    return this;
  }
});

export default PointsView;
