// var $         = require("jquery");
// var _         = require("lodash");
var Backbone  = require("backbone");

const Step = Backbone.View.extend({
  el: "#step-09",
  initialize: function(commonData) {
    window.console.log(commonData);

  },

  resume() {

  }
});

export default Step;
