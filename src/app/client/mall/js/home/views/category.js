/*
  首页商品分类视图
*/
var $         = require("jquery");
var _         = require("lodash");

var BaseView = require("app/client/mall/js/home/views/view.js");
var tplUtil  = require("app/client/mall/js/lib/mall-tpl.js");
var mallUitl = require("app/client/mall/js/lib/util.js");

var IScroll       = require("com/mobile/lib/iscroll/iscroll.js");

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
    myScroll = new IScroll('#test', { scrollX: true, scrollY: false, mouseWheel: true });
    // var sList = $("#test div div");
    // var i = 1;
    // setInterval(function() {
    //   myScroll.scrollToElement(sList.get(i++));
    // },1000);
    return this;
  }
});

module.exports = CategoryView;