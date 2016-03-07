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

  events: {
    "click span[data-category-item]"  : "selectCategory",
    "click a[data-category-item]"     : "checkCategory"
  },

  template: require("app/client/mall/tpl/home/v2/category.tpl"),

  initialize: function () {

  },

  render: function (data) {
    this.$el.html(this.template({
      dataList: data,
      appName: mallUitl.getAppName(),
      tplUtil: tplUtil
    }));
    this.initScroll();
    return this;
  },

  initScroll: function () {
    this.scrollItems  = $("span[data-category-item]", this.$el);
    this.scrollCnt    = $("#categoryScroll>p", this.$el);
    this.categoryList = $("a[data-category-item]", this.$el);
    this.allCategory  = $("[data-category-item]", this.$el);
  },

  selectCategory: function (e) {
    window.console.log("查询商品");
  },

  checkCategory: function (e) {
    var title = $(e.currentTarget).data("categoryItem")
    var scrollItem = $("span[data-category-item=" + title + "]")
    scrollItem.trigger("click");

    // 更改栏目选项样式
    var a = this.allCategory
    .removeClass("on")
    .siblings("[data-category-item=" + title + "]")
    .addClass("on");

    this.scrollCnt.scrollLeft(scrollItem.get(0).offsetLeft);
  },
});

module.exports = CategoryView;