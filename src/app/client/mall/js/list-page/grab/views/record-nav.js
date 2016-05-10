var $        = require("jquery");
var Backbone = require("backbone");

var GoodsListView = Backbone.View.extend({

  el: "#record-nav",

  events:{
    "click [data-route]": "route"
  },

  initialize: function () {

  },

  render: function () {

  },

  update: function (action) {
    $("[data-route]", this.$el).removeClass('on');
    $("[data-route=" + action + "]", this.$el).addClass('on');
  },

  route: function (e) {
    var data = $(e.currentTarget).data("route");
    this.switchTo(data, true, true);

  },

  switchTo: function (view, trigger, replace){
    Backbone.history.navigate(view,{
      trigger: !!trigger,
      replace: !!replace
    });
  }
});
module.exports = GoodsListView;
