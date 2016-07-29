/*
  首页横向滑动推广位
*/
import Backbone from "backbone";
import tplUtil from "app/client/mall/js/lib/mall-tpl.js";
import * as mallUitl from "app/client/mall/js/lib/util.js";

const ActiveView = Backbone.View.extend({

  template: require("app/client/mall/tpl/home/v3/active.tpl"),

  initialize() {},

  render(data) {
    if(!data.length || data.length === 0){
      this.$el.hide();
      return;
    }
    this.$el.html(this.template({
      dataList: data,
      appName : mallUitl.getAppName(),
      tplUtil
    }));

    this.$el.find("ul").width(this.$el.find("ul>li").width() * data.length);
    return this;
  }
});

export default ActiveView;
