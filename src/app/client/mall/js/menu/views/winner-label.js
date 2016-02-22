var $                = require("jquery");
var Backbone         = require("backbone");
var _                = require("lodash");
var widget    = require("app/client/mall/js/lib/widget.js");
var mallUitl      = require("app/client/mall/js/lib/util.js");
var tplUtil       = require("app/client/mall/js/lib/mall-tpl.js");


var WinnerView = Backbone.View.extend({
  el: "#winner-label",

  template: require("app/client/mall/tpl/menu/indiana-winner.tpl"),

  events:{
    "click .js-new-page": "createNewPage"
  },

  initialize: function (options) {
    this.render();
  },

  render: function () {
    this.$el.html(this.template({
      item: {
        action: 2,
        img: "",
        productid: 10000117,
        url: "/fe/app/client/mall/html/list-page/indiana/indiana-record.html"
      },
      appName: mallUitl.getAppName(),
      tplUtil  : tplUtil
    }));
    return this.$el;
  },

  createNewPage: function(e) {
    widget.createAView(e);
  }
});
module.exports = WinnerView;