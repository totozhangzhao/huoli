var _           = require("lodash");
var $           = require("jquery");
var Backbone    = require("backbone");
var widget      = require("app/client/mall/js/lib/common.js");

var AppView = Backbone.View.extend({
  el: "#goods-desc",
  initialize: function(commonData) {
    _.extend(this, commonData);
  },
  resume: function(opts) {
    if (opts.previousView !== "goods-detail") {

      // 为了维护 router 中 previousView 的状态，使用 setTimeout
      setTimeout(function() {
        this.router.switchTo("goods-detail");
      }.bind(this), 0);
      return;
    }

    if (this.title) {
      widget.updateViewTitle(this.title);
    }
    this.render();
  },
  render: function() {
    var tmpl = require("app/client/mall/tpl/detail-page/goods-desc.tpl");

    this.$el.html(tmpl({
      data: this.cache.goods.detail
    }));
  }
});

module.exports = AppView;
