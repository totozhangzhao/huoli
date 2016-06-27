/*
  首页顶部固定入口位
*/
import Backbone from "backbone";
import tplUtil from "app/client/mall/js/lib/mall-tpl.js";
import * as mallUitl from "app/client/mall/js/lib/util.js";

const EntranceView = Backbone.View.extend({

  el: "#home-entrance",

  template: require("app/client/mall/tpl/home/v2/entrance.tpl"),

  initialize() {},

  render(data) {
    if(!data.length || data.length === 0){
      this.$el.hide();
      return;
    }
    const firstLineLength = data.length > 5 && data.length < 9 ? 4 : 5;
    this.$el.html(this.template({
      dataList: data.slice(0,firstLineLength),
      moreDataList: data.slice(firstLineLength),
      appName: mallUitl.getAppName(),
      tplUtil
    })).show();
    return this;
  }
});

export default EntranceView;
