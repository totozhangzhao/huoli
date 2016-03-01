var $         = require("jquery");
var Backbone  = require("backbone");
var _         = require("lodash");

var Util      = require("com/mobile/lib/util/util.js");
var mallUitl  = require("app/client/mall/js/lib/util.js");


var widget    = require("app/client/mall/js/lib/common.js");
var imgDelay  = require("app/client/mall/js/lib/common.js").imageDelay;
var Footer = require("app/client/common/views/footer.js");
var AppView = Backbone.View.extend({
  el: "#main",

  events:{},

  initialize: function () {
    this.$footer = new Footer();
    this.fetchData();
  },

  fetchData: function () {
    this.render();
  },

  render: function () {
    this.showFooter();
    return this;
  },

  showFooter: function() {
    this.$footer.render();
  }
});

new AppView();