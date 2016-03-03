/*
  首页顶部固定入口位
*/
var $         = require("jquery");
var Backbone  = require("backbone");
var _         = require("lodash");

var EntranceView = Backbone.View.extend({
  el: "#home-entrance",

  initialize: function () {
  },

  render: function () {
    this.$el.html("首页入口");
    return this;
  }
});

module.exports = EntranceView;