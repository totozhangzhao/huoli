// 频道商品列表
import {parseUrlSearch as parseUrl} from "com/mobile/lib/url/url.js";
import * as widget from "app/client/mall/js/lib/common.js";
import * as mallUtil from "app/client/mall/js/lib/util.js";
import ui from "app/client/mall/js/lib/ui.js";
import {initTracker} from "app/client/mall/js/lib/common.js";
import * as mallWechat from "app/client/mall/js/lib/wechat.js";
import {sendPost} from "app/client/mall/js/lib/mall-request.js";
import {toast} from "com/mobile/widget/hint/hint.js";
// import * as tplUtil from "app/client/mall/js/lib/mall-tpl.js";
import {imageDelay} from "app/client/mall/js/lib/common.js";
// logs
import logger from "com/mobile/lib/log/log.js";
const categoryListLog = initTracker("categoryList");
// views
import BaseView from "app/client/mall/js/common/views/BaseView.js";
import Footer from "app/client/mall/js/common/views/footer.js";
import BackTop from "com/mobile/widget/button/to-top.js";
import Navigator from "app/client/mall/js/common/views/header/navigator.js";
import GoodsItemView from "app/client/mall/js/list-page/category/views/goods-item.js";
// collections
import GoodsCollection from "app/client/mall/js/list-page/category/collections/goods-list.js";

var goods = new GoodsCollection();
const AppView = BaseView.extend({
  el: "#main",

  events: {
    "click .js-new-page": "createNewPage",
    "click .js-get-url" : "handleGetUrl"
  },

  initialize() {
    const nav = new Navigator();
    nav.render();
    new BackTop();
    const title       = parseUrl().title || document.title;
    this.$initial = ui.initial().show();
    this.groupId    = parseUrl().groupId;
    this.$footer    = new Footer();
    this.fetch();
    logger.track(`${mallUtil.getAppName()}PV`, "View PV", title);
  },

  render() {
    goods.forEach((item) => {
      let view = new GoodsItemView({model: item});
      this.$el.find("#goods-container").append(view.render().$el);
    });
    imageDelay();
    this.$footer.render();
    this.$initial.hide();
    this.logger(this.result.title);
    mallWechat.initShare({
      wechatshare: this.result.wechatshare,
      title: this.result.title
    });
    return this;
  },

  fetch() {
    let params = {
      groupId: this.groupId
    };
    sendPost("classifyGoods", params, (err, result) => {
      if (err) {
        toast(err.message, 1500);
        return;
      }
      this.result = result;
      goods.push(this.result.goods);
      this.render();
    });
  },

  logger(title) {
    widget.updateViewTitle(title);
    categoryListLog({
      productid: this.groupId,
      title,
      hlfrom: parseUrl().hlfrom || "--"
    });
  }
});

new AppView();
