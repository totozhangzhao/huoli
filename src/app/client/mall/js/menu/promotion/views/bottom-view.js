var $        = require("jquery");
var Backbone = require("backbone");
var _        = require("lodash");

var BottomView  = Backbone.View.extend({

  el: "#bottom",

  events: {},

  initialize: function () {
    this.$el.html("bottom");
  }
});
module.exports = BottomView;
