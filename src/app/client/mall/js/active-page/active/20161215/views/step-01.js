// var $         = require("jquery");
// var _         = require("lodash");
var Backbone  = require("backbone");

const Step1 = Backbone.View.extend({
  el: "#step-1",
  initialize: function(commonData) {
    window.console.log(commonData);

  },

  resume() {

  }
});

export default Step1;
