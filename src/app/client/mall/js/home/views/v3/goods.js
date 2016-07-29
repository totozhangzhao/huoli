
/*
  首页商品视图
*/
import Backbone from "backbone";
import tplUtil from "app/client/mall/js/lib/mall-tpl.js";
import * as mallUitl from "app/client/mall/js/lib/util.js";
import {imageDelay} from "app/client/mall/js/lib/common.js";

const GoodsView = Backbone.View.extend({

  template: require("app/client/mall/tpl/home/v3/goods.tpl"),

  initialize() {

  },

  render(data) {
    if(data && data.length >0) {
      window.console.log(data);
      this.$el.html(this.template({
        dataList: data,
        appName : mallUitl.getAppName(),
        tplUtil
      }));
      imageDelay();
    }
    return this;
  }
});

module.exports = GoodsView;
