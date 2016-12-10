// var $         = require("jquery");
// var _         = require("lodash");
var Backbone  = require("backbone");

import template from "app/client/mall/tpl/active-page/active/20161215/info.tpl";
const InfoView = Backbone.View.extend({
  el: "#info",

  events: {

  },

  initialize: function(commonData) {
    window.console.log(commonData);
  },

  render() {
    this.$el.html(template());
  },

  resume() {
    this.render();
  }
});

export default InfoView;
