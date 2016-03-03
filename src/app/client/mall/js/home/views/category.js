/*
  首页商品分类视图
*/
var $         = require("jquery");
var _         = require("lodash");

var BaseView = require("app/client/mall/js/home/views/view.js");
var tplUtil  = require("app/client/mall/js/lib/mall-tpl.js");
var mallUitl = require("app/client/mall/js/lib/util.js");


var CategoryView = BaseView.extend({

  el: "#home-category",

  events: {},

  template: require("app/client/mall/tpl/home/v2/category.tpl"),

  initialize: function () {

  },

  render: function () {
    this.$el.html(this.template({
      appName: mallUitl.getAppName(),
      tplUtil: tplUtil
    }));
    return this;
  }
});

module.exports = CategoryView;