import Backbone from "backbone";
import * as mallUtil from "app/client/mall/js/lib/util.js";
import * as tplUtil from "app/client/mall/js/lib/mall-tpl.js";
import {imageDelay as imgDelay} from "app/client/mall/js/lib/common.js";

const GoodsListView = Backbone.View.extend({

  initialize() {

  },

  renderGoods(data) {
    this.$el.html(this.template({
      dataList: data,
      appName: mallUtil.getAppName(),
      tplUtil
    }));
    imgDelay();
    return this;
  },

  addMore(data) {
    this.$el.append(this.template({
      dataList: data,
      appName: mallUtil.getAppName(),
      tplUtil
    }));

  }
});
export default GoodsListView;
