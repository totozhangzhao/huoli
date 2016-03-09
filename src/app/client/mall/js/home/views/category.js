/*
  首页商品分类视图
*/
var $        = require("jquery");
var _        = require("lodash");

var BaseView = require("app/client/mall/js/home/views/view.js");
var tplUtil  = require("app/client/mall/js/lib/mall-tpl.js");
var mallUitl = require("app/client/mall/js/lib/util.js");

var IScroll  = require("com/mobile/lib/iscroll/iscroll.js");

var CategoryView = BaseView.extend({

  el: "#home-category",

  events: {
    "click span[data-category-item]"  : "checkCategory",
    "click a[data-category-item]"     : "checkCategory",
    "click .home-list-switch"         : "showCagetoryListPannel"
  },

  template: require("app/client/mall/tpl/home/v2/category.tpl"),

  initialize: function (options) {
    this.listenTo(this.model, "change", this.stateChange);
  },

  render: function (data) {
    if(!data.length){
      this.$el.hide();
      return;
    }
    this.$el.html(this.template({
      dataList: data,
      appName: mallUitl.getAppName(),
      tplUtil: tplUtil
    }));
    this.initScroll();
    return this;
  },

  initScroll: function () {
    // 滚动容器
    var scrollCnt    = $("#categoryScroll", this.$el);
    // 滚动列表
    var scrollItems  = $("span[data-category-item]", this.$el);
    // 数据列表
    var categoryList = $("a[data-category-item]", this.$el);
    // 滚动列表和数据列表
    var allCategory  = $("[data-category-item]", this.$el);

    // 滚动容器总宽度
    var width = 0;
    _.each(scrollItems, function (item, index) {
      width += item.offsetWidth;
    });
    scrollCnt.find("p").css({width:width + 10});
    var widthFix = width - scrollCnt.get(0).offsetWidth;
    // 最大滚动位移
    var maxScrollLeft = widthFix + (80-(widthFix%80));
    this.scrollObj = {
      scrollCnt: scrollCnt,
      allCategory: allCategory,
      width: width, // 滚动区域总宽度
      cntWidth: scrollCnt.get(0).offsetWidth,
      maxScrollLeft: maxScrollLeft
    };
  },

  checkCategory: function (e) {
    var _el = $(e.currentTarget);
    if(_el.hasClass("on")){
      return;
    }
    
    var classify = _el.data("categoryItem");
    this.scrollObj.allCategory
        .removeClass("on")
      .siblings("[data-category-item=" + classify + "]")
        .addClass("on");

    this.model.set({
      status: 1,
      classify: classify
    });

    if(_el.data("scrollItem")){
      return; 
    }
    // 滚动
    // 设置滚动位置
    var scrollItem = $("span[data-category-item=" + classify + "]");
    var _left = scrollItem.get(0).offsetLeft;
    // 不需要滚动
    if(this.scrollObj.width <= this.scrollObj.cntWidth){
      return;
    }
    // 滚动到最后一页
    if(this.scrollObj.width - _left <= this.scrollObj.cntWidth){
      _left = this.scrollObj.maxScrollLeft + 5;
    }
    return this.scrollObj.scrollCnt.scrollLeft(_left - 5);
  },



  // 数据列表面板显示隐藏
  showCagetoryListPannel: function (e) {
    if($(e.currentTarget).hasClass("home-rotate-switch")){
      return this.hidePannel();
    }
    return this.showPannel();
  },

  showPannel: function () {
    $(".home-list-switch", this.$el).addClass("home-rotate-switch");
    return $(".home-goods-shadow").show();
  },
  hidePannel: function () {
    $(".home-list-switch", this.$el).removeClass("home-rotate-switch");
    return $(".home-goods-shadow").hide();
  },

  stateChange: function (e) {
    if(e.hasChanged("status") && e.get("status") !== 1){
      return this.hidePannel();
    }
  }
});

module.exports = CategoryView;