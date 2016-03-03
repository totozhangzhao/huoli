/*
  首页商品分类视图
*/
var $         = require("jquery");
var Backbone  = require("backbone");
var _         = require("lodash");

var CategoryView = Backbone.View.extend({
  el: "#home-category",

  initialize: function () {

  },

  render: function () {
    this.$el.html("分类");
    return this;
  }
});

module.exports = CategoryView;