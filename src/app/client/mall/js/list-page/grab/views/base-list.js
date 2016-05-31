import Backbone from "backbone";
import mallUitl from "app/client/mall/js/lib/util.js";
import tplUtil from "app/client/mall/js/lib/mall-tpl.js";
import {imageDelay as imgDelay} from "app/client/mall/js/lib/common.js";

const GoodsListView = Backbone.View.extend({

  initialize() {

  },

  renderGoods(data) {
    this.$el.html(this.template({
      dataList: data,
      appName: mallUitl.getAppName(),
      tplUtil
    }));
    imgDelay();
    return this;
  },

  addMore(data) {
    this.$el.append(this.template({
      dataList: data,
      appName: mallUitl.getAppName(),
      tplUtil
    }));

  }
});
export default GoodsListView;
