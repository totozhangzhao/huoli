/*
  首页banner视图
*/
var $         = require("jquery");
var Backbone  = require("backbone");
var _         = require("lodash");


var BannerView = Backbone.View.extend({
  el: "#home-banner",

  initialize: function () {
  },

  render: function () {
    this.$el.html("首页banner视图。。。");
    return this;
  }
});

module.exports = BannerView;