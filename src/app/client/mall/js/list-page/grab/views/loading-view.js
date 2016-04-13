var $        = require("jquery");
var Backbone = require("backbone");
var _        = require("lodash");


var LoadingView = Backbone.View.extend({

  el: "#loading-more",

  initialize: function () {
  },

  show: function () {
    this.$el.show();
  },

  hide: function () {
    this.$el.hide();
  }
});
module.exports = LoadingView;
