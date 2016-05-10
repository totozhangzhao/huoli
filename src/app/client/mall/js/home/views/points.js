/*
  首页推广位视图
*/
var $          = require("jquery");
var Backbone   = require("backbone");
var PointsView = Backbone.View.extend({

  el: "#home-points",

  initialize: function (){},

  render: function (data) {
    $(".num-font", this.$el).html(data.points)
    .end()
    .show();
    return this;
  }
});

module.exports = PointsView;
