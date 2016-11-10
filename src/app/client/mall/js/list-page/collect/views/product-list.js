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
import Popover from "com/mobile/widget/popover/popover.js";
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
    "click .js-clear-outstock": "clearOutOfStock",
    "touchstart [data-remove-id]"  : "beginTouch",
    "touchmove [data-remove-id]"  : "touchMove",
    "touchend [data-remove-id]"    : "endTouch",
  },

  initialize() {
    window.aaa = this;
    this.touchTimeoutId = null;
    this.productList = new Products();
    this.nav = new Navigator();
    this.nav.render();
    this.$initial = ui.initial().show();
    this.type = 1;  // 1: 全部， 2: 仅显示有货
    this.hasMore = true;
    this.fetch();
    this.bindEvents();
    logger.track(mallUtil.getAppName() + "PV", "View PV", document.title);
  },

  bindEvents() {
    const screenHeight = $(window).height();
    const edgeHeight = screenHeight * 0.35;
    $(window).on("scroll", () => {
      if (this.loading) {
        return;
      }
      if ( $(window).scrollTop() + screenHeight > $(document).height() - edgeHeight ) {
        this.loadMore();
      }
    });
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
    if(!this.hasMore) {
      return;
    }
    this.loading = true;
    // hint.showLoading();
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
            this.$initial.hide();
            // hint.hideLoading();
            this.loading = false;
            if (err) {
              reject(err);
            } else {
              resolve(data);
            }
          });
        });
      })
      .then((result) => {
        if(result.length > 0) {
          this.productList.push(result);
        } else {
          this.hasMore = false;
        }
        this.render();
      })
      .catch(err => {
        mallPromise.catchFn(err);
      });
  },

  render() {
    if(this.productList.length === 0) {
      $('.ui-blank').show();
      return;
    }
    $('.ui-blank').hide();
    this.productList.showOutOfStock(this.type)
    .where({isRender: false})
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
    hint.showLoading();
    // 没有库存的商品列表
    let list = this.productList.reject((item) => {
      return _.inRange(item.get("status").code, 1, 3);
    });
    this.removeCollectByProducts(list);
  },

  loadMore() {
    this.fetch();
  },

  removeItem(e) {
    let confirm = new Popover({
      type: "confirm",
      title: "确定删除此商品吗？",
      message: "",
      agreeText: "删除",
      cancelText: "取消",
      agreeFunc:() => {
        let productid = $(e.currentTarget).data("removeId");
        let list = this.productList.where({productid: productid});
        this.removeCollectByProducts(list);
      },
      cancelFunc() {}
    });
    confirm.show();
  },

  beginTouch(e) {
    this.touchTimeoutId = setTimeout(() => {
      window.clearTimeout(this.touchTimeoutId);
      this.touchTimeoutId = null;
      e.preventDefault();
      this.removeItem(e);
    }, 800);
  },

  touchMove() {
    window.clearTimeout(this.touchTimeoutId);
    this.touchTimeoutId = null;
  },

  endTouch(e) {
    e.preventDefault();
    if(this.touchTimeoutId != null) {
      window.clearTimeout(this.touchTimeoutId);
      this.touchTimeoutId = null;
      this.createNewPage(e);
    }
  },

  /**
   * 删除指定的商品列表
   * @param  {Backbone.Collection} list - 要删除的商品列表
   * @return {void}
   */
  removeCollectByProducts(list) {
    if(list.length === 0 ) {
      return;
    }
    // 商品id逗号分隔字符串
    let productids = _.map(list,(item) => {
      return item.get("productid");
    }).toString();
    mallPromise
      .checkLogin({ reset: true })
      .then(userData => {
        let params = _.extend({}, userData.userInfo, {
          productid: productids,        // 逗号隔开的productid字符串
          type: 1,                      // 1 条件删除  2 全部删除
        });
        return new Promise((resolve, reject) => {
          sendPost("removeCollect", params, (err, data) => {
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
        if(result === "ok") {
          list.every((item) => {
            item.destroy();
            return true;
          });
        }
      })
      .catch(err => {
        mallPromise.catchFn(err);
      });
  }
});

export default ProductCollectListView;
