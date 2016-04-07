// var _           = require("lodash");
var $           = require("jquery");
var Backbone    = require("backbone");

var AppView = Backbone.View.extend({
  el: "#goods-desc",
  initialize: function(commonData) {
    _.extend(this, commonData);
    this.render();
  },
  resume: function() {
    if (this.title) {
      widget.updateViewTitle(this.title);
    }
  },
  render: function() {
    var tmpl = require("app/client/mall/tpl/detail-page/goods-desc.tpl");

    this.$el.html(tmpl({
      data: this.cache.goods.detail
    }));
  }
});

module.exports = AppView;
