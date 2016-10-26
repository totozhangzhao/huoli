/*
  首页推广位视图
*/
import Backbone from "backbone";
import * as tplUtil from "app/client/mall/js/lib/mall-tpl.js";
import * as mallUtil from "app/client/mall/js/lib/util.js";

const PromotionView = Backbone.View.extend({

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
  }
});

export default PromotionView;
