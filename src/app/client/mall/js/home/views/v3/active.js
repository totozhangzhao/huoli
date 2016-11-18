/*
  首页横向滑动推广位
*/
import $ from "jquery";
import Backbone from "backbone";
import * as tplUtil from "app/client/mall/js/lib/mall-tpl.js";
import * as mallUtil from "app/client/mall/js/lib/util.js";

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
      appName : mallUtil.getAppName(),
      tplUtil
    }));

    const $ul = this.$el.find(".js-row-container");
    $ul.width(  Math.max($("body").width() + 20, $ul.find(">li").outerWidth(true) * data.length + 20)  );
    return this;
  }
});

export default ActiveView;
