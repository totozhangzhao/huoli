/*
  首页推广位视图
*/
var $         = require("jquery");
var Backbone  = require("backbone");
var _         = require("lodash");

var PromotionView = Backbone.View.extend({
  el: "#home-promotion",

  initialize: function (){
  },

  render: function () {
    this.$el.html("推广位");
    return this;
  }
});

module.exports = PromotionView;