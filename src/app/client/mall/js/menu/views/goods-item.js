var $                = require("jquery");
var Backbone         = require("backbone");
var _                = require("lodash");


var GoodsItemView = Backbone.View.extend({
  tagName: "div",

  className: "goods-item-box",

  events:{},

  initialize: function (options) {

  },

  render: function (data) {
    this.$el.html(JSON.stringify(data));
    return this.$el;
  }
});
module.exports = GoodsItemView;