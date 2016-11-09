import $ from "jquery";
import _ from "lodash";
import Backbone from "backbone";
// import cookie from "com/mobile/lib/cookie/cookie.js";
// import {config} from "app/client/mall/js/common/config.js";
import NativeAPI from "app/client/common/lib/native/native-api.js";
import {sendPost} from "app/client/mall/js/lib/mall-request.js";
import ui from "app/client/mall/js/lib/ui.js";
import * as mallPromise from "app/client/mall/js/lib/mall-promise.js";
import logger from "com/mobile/lib/log/log.js";
import * as mallUtil from "app/client/mall/js/lib/util.js";
import * as widget from "app/client/mall/js/lib/common.js";
import hint from "com/mobile/widget/hint/hint.js";


// collections
import Products from "app/client/mall/js/list-page/collect/collections/products.js";
// views
import Navigator from "app/client/mall/js/common/views/header/navigator.js";
import ProductItemView from "app/client/mall/js/list-page/collect/views/product-item.js";
const ProductCollectListView = Backbone.View.extend({
  el: "#product-collect-container",

  events: {
    "click .js-stock": "replaceView",
    "click .js-new-page": "createNewPage",
    "click .js-clear-outstock": "clearOutOfStock"
  },

  initialize() {
    this.productList = new Products();
    this.nav = new Navigator();
    this.nav.render();
    this.$initial = ui.initial().show();
    this.$initial.hide();
    this.type = 1;  // 1: 全部， 2: 仅显示有货
    this.fetch();
    logger.track(mallUtil.getAppName() + "PV", "View PV", document.title);
  },


  registerAppResume() {
    NativeAPI.registerHandler("resume", () => {
    });
  },

  showList(type) {
    this.type = type;
    this.productList.showOutOfStock(this.type);
    if(this.type === 1) {
      $(".js-stock", this.$el).data("replaceView", "list/stock");
    }else {
      $(".js-stock", this.$el).data("replaceView", "list/all");
    }
  },

  fetch() {
    mallPromise
      .checkLogin({ reset: true })
      .then(userData => {
        let last = this.productList.length > 0 ? this.productList.last().get("collectTime"): '';
        let params = _.extend({}, userData.userInfo, {
          searchType: 0,         // searchType 0 全部， 1 搜索
          key: '',
          last
        });
        return new Promise((resolve, reject) => {
          sendPost("collectList", params, (err, data) => {
            hint.hideLoading();
            if (err) {
              reject(err);
            } else {
              resolve(data);
            }
          });
        });
      })
      .then((result) => {
        result[0].status.code=3;
        this.productList.push(result);
        this.render();
      })
      .catch(err => {
        mallPromise.catchFn(err);
      });
  },

  render() {
    this.productList.showOutOfStock(this.type)
    .where({isRander: false})
    .forEach((item) => {
      this.$el.find("#product-list-container")
      .append(new ProductItemView({model: item}).render().$el);
    });
  },


  replaceView(e) {
    let view = $(e.currentTarget).data("replaceView");
    Backbone.history.navigate(view, {
      trigger: true,
      replace: true
    });
  },

  /**
   * @param  {clickevent} e - 点击事件
   * @return {void}
   */
  createNewPage(e) {
    e.preventDefault();
    widget.createAView(e);
  },

  /**
   * 清空停售商品
   * @return {void}
   */
  clearOutOfStock() {

  }
});

export default ProductCollectListView;
