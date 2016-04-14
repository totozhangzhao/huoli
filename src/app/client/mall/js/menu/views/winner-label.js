var $        = require("jquery");
var Backbone = require("backbone");
var _        = require("lodash");
var widget   = require("app/client/mall/js/lib/common.js");
var mallUitl = require("app/client/mall/js/lib/util.js");
var tplUtil  = require("app/client/mall/js/lib/mall-tpl.js");
var UrlUtil  = require("com/mobile/lib/url/url.js");
var Marquee  = require("com/mobile/widget/marquee/marquee.js");
var BaseView = require("app/client/mall/js/common/views/BaseView.js");

var WinnerView = BaseView.extend({
  el: "#winner-label",

  template: require("app/client/mall/tpl/menu/grab/grab-winner.tpl"),

  initialize: function () {

    this.render();
  },

  render: function (data) {
    this.$el.html(this.template({
      dataList: this.model,
      pId: UrlUtil.parseUrlSearch().productid,
      appName: mallUitl.getAppName(),
      tplUtil  : tplUtil
    }));
    new Marquee({
      box: $("#winner-label .crowd-nav-tip"),
      items: $("#winner-label .crowd-nav-tip .marquee-item"),
      speed: 800,
      interval: 5000,
      direction: 2
    });
    return this.$el;
  },

  createNewPage: function(e) {
    widget.createAView(e);
  }
});
module.exports = WinnerView;
