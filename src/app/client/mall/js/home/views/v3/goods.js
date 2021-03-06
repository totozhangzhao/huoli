
/*
  首页商品视图
*/
import Backbone from "backbone";
import * as tplUtil from "app/client/mall/js/lib/mall-tpl.js";
import * as mallUtil from "app/client/mall/js/lib/util.js";

const GoodsView = Backbone.View.extend({

  template: require("app/client/mall/tpl/home/v3/goods.tpl"),

  initialize() {

  },

  render(data) {
    if(data && data.length >0) {
      this.$el.html(this.template({
        dataList: data,
        appName : mallUtil.getAppName(),
        tplUtil
      }));

    }
    return this;
  }
});

module.exports = GoodsView;
