var $         = require("jquery");
var Backbone  = require("backbone");

var Util      = require("com/mobile/lib/util/util.js");
var mallUitl  = require("app/client/mall/js/lib/util.js");

var crTpl = require("app/client/mall/tpl/copyright.tpl");


var Footer = Backbone.View.extend({

  el: '#copyright',

  events: {},

  initialize: function () {
  },
  render: function () {
    this.$el.html(crTpl({
      system: Util.getMobileSystem(),
      isHangbanFunc: mallUitl.isHangbanFunc()
    }));
  } 
})
module.exports = Footer;