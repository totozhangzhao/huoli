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
    "click .home-list-fa": "selectItem"
  },

  template: require("app/client/mall/tpl/home/v2/category.tpl"),

  initialize: function () {

  },

  render: function () {
    this.$el.html(this.template({
      appName: mallUitl.getAppName(),
      tplUtil: tplUtil
    }));
    this.initScroll();
    
    return this;
  },

  initScroll: function () {
    this.scrollItems = $("#categoryScroll>p>span");
    var _width = this.scrollItems.get(0).offsetWidth * this.scrollItems.length;
    $("#categoryScroll>p").css("width",_width);
    var myScroll = new IScroll(
      '#categoryScroll', 
      { 
        scrollX: true, 
        scrollY: true, 
        mouseWheel: false 
      }
    );
  },

  selectItem: function (e) {
    window.console.log(e);
    this.scrollItems
      .removeClass("on")
      .addClass("off")
      .eq(index)
      .addClass("on")
      .removeClass("off")
      .end();
    myScroll.scrollToElement(scrollItems.get(index));
  }
});

module.exports = CategoryView;