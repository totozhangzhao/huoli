/*
  首页商品分类视图
*/
var $        = require("jquery");
var _        = require("lodash");


var tplUtil  = require("app/client/mall/js/lib/mall-tpl.js");
var mallUitl = require("app/client/mall/js/lib/util.js");

var BaseView    = require("app/client/mall/js/common/views/BaseView.js");

var CategoryView = BaseView.extend({

  el: "#home-category",

  events: {
    "click span[data-group-id]"  : "checkCategory",
    "click a[data-group-id]"     : "checkCategory",
    "click .home-list-switch"    : "showCagetoryListPannel"
  },

  template: require("app/client/mall/tpl/home/v2/category.tpl"),

  initialize: function (options) {
    this.listenTo(this.model, "change:status", this.stateChange);
  },

  render: function (data) {
    if(!data.length || data.length === 0){
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
    var scrollItems  = $("span[data-group-id]", this.$el);
    // 数据列表
    var categoryList = $("a[data-group-id]", this.$el);
    // 滚动列表和数据列表
    var allCategory  = $("[data-group-id]", this.$el);

    // 滚动容器总宽度
    var width = 0;
    _.each(scrollItems, function (item, index) {
      width += item.offsetWidth;
    });
    var uWidth = width/scrollItems.length; // 每一项的平均宽度
    scrollCnt.find("p").css({width:width + 30}); // 增加滚动元素外容器30像素 用来修正移动后 第一项位置的不同
    var widthFix = width - scrollCnt.get(0).offsetWidth;
    // 最大滚动位移
    var maxScrollLeft = widthFix + (uWidth - (widthFix % uWidth));
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

    var groupId = _el.data("groupId");
    this.scrollObj.allCategory
      .siblings(".on")
        .removeClass("on")
      .end()
      .siblings("[data-group-id=" + groupId + "]")
        .addClass("on");

    this.model.set({
      status: 1,
      groupId: groupId,
      logger: _el.data("info")
    });

    if(_el.data("scrollItem")){
      //点击滚动区域的分类时，不滚动
      // return;
    }
    // 滚动
    // 设置滚动位置
    var scrollItem = $("span[data-group-id=" + groupId + "]");
    var _left = scrollItem.get(0).offsetLeft;
    // 不需要滚动
    if(this.scrollObj.width <= this.scrollObj.cntWidth){
      return;
    }
    // 滚动到最后一页
    if(this.scrollObj.width - _left <= this.scrollObj.cntWidth){
      _left = this.scrollObj.maxScrollLeft;
    }
    return this.scrollObj.scrollCnt.scrollLeft(_left);
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
    return $(".home-goods-shadow")
            .show()
            .off("click")
            .one('click', function(event) {
              this.hidePannel();
            }.bind(this));
  },
  hidePannel: function () {
    $(".home-list-switch", this.$el).removeClass("home-rotate-switch");
    return $(".home-goods-shadow").hide();
  },

  stateChange: function (e) {
    if(e.get("status") !== 1){
      return this.hidePannel();
    }
  },

  fix: function () {
    if(this.$el.hasClass('fix')){
      return;
    }
    $("#home-category-fix").show();
    return this.$el.addClass('fix');
  },

  rel: function () {
    if(this.$el.hasClass('fix')){
      $("#home-category-fix").hide();
      return this.$el.removeClass('fix');
    }
  }
});

module.exports = CategoryView;
