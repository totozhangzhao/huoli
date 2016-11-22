// import _ from "lodash";
import Backbone from "backbone";
import * as mallWechat from "app/client/mall/js/lib/wechat.js";
import ProductCollectListView from "app/client/mall/js/list-page/collect/views/product-list.js";
import "app/client/mall/js/lib/common.js";
var ProductCollectRouter = Backbone.Router.extend({
  routes: {
    "": "toDefault",
    "list(/:view)": "listDispatcher"        // view  all 全部  stock 有库存
  },

  initialize() {
    this.defaultView = "list/all";
    this.productList = new ProductCollectListView();
    this.registerShare();
  },

  toDefault() {
    this.navigate(this.defaultView, {
      trigger: true,
      replace: true
    });
  },


  listDispatcher(view) {
    switch(view) {
      case "all":
        // 1 显示全部 2 显示有货
        this.productList.showList(1);
        break;
      case "stock":
        this.productList.showList(2);
        break;
      default:
        this.toDefault();
    }
  },

  /**
   * 设置分享参数
   * @return {void}
   */
  registerShare() {
    mallWechat.initShare();
  }
});

export default ProductCollectRouter;
