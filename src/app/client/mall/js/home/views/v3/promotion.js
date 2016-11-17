/*
  首页推广位视图
*/
import $ from "jquery";
import Backbone from "backbone";
import * as tplUtil from "app/client/mall/js/lib/mall-tpl.js";
import * as mallUtil from "app/client/mall/js/lib/util.js";
import * as widget from "app/client/mall/js/lib/common.js";

const PromotionView = Backbone.View.extend({
  events: {
    "click .js-replace-view"  : "replaceView"
  },

  template: require("app/client/mall/tpl/home/v3/promotion.tpl"),

  initialize() {},

  render(data) {
    if(!data.length || data.length === 0){
      this.$el.hide();
      return;
    }
    this.$el.html(this.template({
      dataList: data,
      appName : mallUtil.getAppName(),
      tplUtil
    }));
    return this;
  },

  replaceView(e) {
    e.preventDefault();
    if($(e.currentTarget).hasClass('on')) {
      return;
    }
    let url = tplUtil.getBottomMenuUrl($(e.currentTarget).data("menu"));
    widget.replacePage(url);
  }
});

export default PromotionView;
