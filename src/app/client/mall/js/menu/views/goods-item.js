var $        = require("jquery");
var Backbone = require("backbone");
var _        = require("lodash");

var widget   = require("app/client/mall/js/lib/common.js");
var mallUitl = require("app/client/mall/js/lib/util.js");
var tplUtil  = require("app/client/mall/js/lib/mall-tpl.js");

var GoodsItemView = Backbone.View.extend({
  tagName: "li",

  template: require("app/client/mall/tpl/menu/grab/goods-item.tpl"),
  events:{
    "click .js-new-page": "createNewPage"
  },

  initialize: function (options) {

  },

  render: function (data) {
    this.$el.html(this.template({
      item: data.toJSON(),
      appName: mallUitl.getAppName(),
      tplUtil  : tplUtil
    }));
    return this;
  },
  createNewPage: function(e) {
    widget.createAView(e);
  }
});
module.exports = GoodsItemView;