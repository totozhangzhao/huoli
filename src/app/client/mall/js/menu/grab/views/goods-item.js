import Backbone from "backbone";
import * as mallUitl from "app/client/mall/js/lib/util.js";
import * as tplUtil from "app/client/mall/js/lib/mall-tpl.js";
import {imageDelay as imgDelay} from "app/client/mall/js/lib/common.js";

const GoodsItemView = Backbone.View.extend({

  template: require("app/client/mall/tpl/menu/grab/goods-item.tpl"),


  initialize() {

  },

  render(data) {
    this.$el.html(this.template({
      dataList: data,
      appName: mallUitl.getAppName(),
      tplUtil
    }))
    .show();
    imgDelay();
    return this;
  }
});
export default GoodsItemView;
