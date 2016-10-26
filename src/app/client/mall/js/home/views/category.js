/*
  首页商品分类视图
*/
import $ from "jquery";
import Backbone from "backbone";
import _ from "lodash";
import * as tplUtil from "app/client/mall/js/lib/mall-tpl.js";
import * as mallUtil from "app/client/mall/js/lib/util.js";

const CategoryView = Backbone.View.extend({

  el: "#home-category",

  events: {
    "click span[data-group-id]"  : "checkCategory",
    "click a[data-group-id]"     : "checkCategory",
    "click .home-list-switch"    : "showCagetoryListPannel"
  },

  template: require("app/client/mall/tpl/home/v2/category.tpl"),

  initialize() {
    this.listenTo(this.model, "change:status", this.stateChange);
  },

  render(data) {
    if(!data.length || data.length === 0){
      this.$el.hide();
      return;
    }
    this.$el.html(this.template({
      dataList: data,
      appName: mallUtil.getAppName(),
      tplUtil
    }));
    this.initScroll();
    return this;
  },

  initScroll() {
    // 滚动容器
    const scrollCnt    = $("#categoryScroll", this.$el);
    // 滚动列表
    const scrollItems  = $("span[data-group-id]", this.$el);
    // 数据列表
    // var categoryList = $("a[data-group-id]", this.$el);
    // 滚动列表和数据列表
    const allCategory  = $("[data-group-id]", this.$el);

    // 滚动容器总宽度
    let width = 0;
    _.each(scrollItems, item => {
      width += item.offsetWidth;
    });
    const uWidth = width/scrollItems.length; // 每一项的平均宽度
    scrollCnt.find("p").css({width:width + 30}); // 增加滚动元素外容器30像素 用来修正移动后 第一项位置的不同
    const widthFix = width - scrollCnt.get(0).offsetWidth;
    // 最大滚动位移
    const maxScrollLeft = widthFix + (uWidth - (widthFix % uWidth));
    this.scrollObj = {
      scrollCnt,
      allCategory,
      width, // 滚动区域总宽度
      cntWidth: scrollCnt.get(0).offsetWidth,
      maxScrollLeft
    };
  },

  checkCategory(e) {
    const _el = $(e.currentTarget);
    if(_el.hasClass("on")){
      return;
    }

    const groupId = _el.data("groupId");
    this.scrollObj.allCategory
      .siblings(".on")
        .removeClass("on")
      .end()
      .siblings(`[data-group-id=${groupId}]`)
        .addClass("on");

    this.model.set({
      status: 1,
      groupId,
      logger: _el.data("info")
    });

    if(_el.data("scrollItem")){
      //点击滚动区域的分类时，不滚动
      // return;
    }
    // 滚动
    // 设置滚动位置
    const scrollItem = $(`span[data-group-id=${groupId}]`);
    let _left = scrollItem.get(0).offsetLeft;
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
  showCagetoryListPannel(e) {
    if($(e.currentTarget).hasClass("home-rotate-switch")){
      return this.hidePannel();
    }
    return this.showPannel();
  },

  showPannel() {
    $(".home-list-switch", this.$el).addClass("home-rotate-switch");
    return $(".home-goods-shadow")
            .show()
            .off("click")
            .one('click', () => {
              this.hidePannel();
            });
  },
  hidePannel() {
    $(".home-list-switch", this.$el).removeClass("home-rotate-switch");
    return $(".home-goods-shadow").hide();
  },

  stateChange(e) {
    if(e.get("status") !== 1){
      return this.hidePannel();
    }
  },

  fix() {
    if(this.$el.hasClass('fix')){
      return;
    }
    $("#home-category-fix").show();
    return this.$el.addClass('fix');
  },

  rel() {
    if(this.$el.hasClass('fix')){
      $("#home-category-fix").hide();
      return this.$el.removeClass('fix');
    }
  }
});

export default CategoryView;
