var $         = require("jquery");
var Backbone  = require("backbone");

var Util      = require("com/mobile/lib/util/util.js");
var mallUitl  = require("app/client/mall/js/lib/util.js");

var BaseView    = require("app/client/mall/js/common/views/BaseView.js");

var Footer = BaseView.extend({

  el: '#copyright',

  events: {
    "click .js-new-page-footer": "createNewPage",
  },

  template: require("app/client/mall/tpl/copyright.tpl"),

  initialize: function () {
  },

  render: function () {
    this.$el.html(this.template({
      system: Util.getMobileSystem(),
      isHangbanFunc: mallUitl.isHangbanFunc()
    }));
    return this;
  }
});
module.exports = Footer;
