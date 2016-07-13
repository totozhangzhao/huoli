import {parseUrlSearch as parseUrl} from "com/mobile/lib/url/url.js";
import * as widget from "app/client/mall/js/lib/common.js";
import * as mallUitl from "app/client/mall/js/lib/util.js";
import ui from "app/client/mall/js/lib/ui.js";
import logger from "com/mobile/lib/log/log.js";
import {initTracker} from "app/client/mall/js/lib/common.js";
import * as mallWechat from "app/client/mall/js/lib/wechat.js";

import StateModel from "app/client/mall/js/common/models/state.js";
import BaseView from "app/client/mall/js/common/views/BaseView.js";
import GoodsView from "app/client/mall/js/common/views/index-goods.js";
import Footer from "app/client/mall/js/common/views/footer.js";
import BackTop from "com/mobile/widget/button/to-top.js";
import Navigator from "app/client/mall/js/menu/header/navigator.js";
const menuLog = initTracker("menu");
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
    this.stateModel = new StateModel();
    this.$footer    = new Footer();
    this.$goodsView = new GoodsView({model: this.stateModel});
    this.listenTo(this.stateModel, "change", this.stateChange);
    this.render();
    logger.track(`${mallUitl.getAppName()}PV`, "View PV", title);
  },

  render() {
    this.stateModel.set({
      status: 1,
      groupId: this.groupId
    });
    this.$footer.render();
    return this;
  },

  stateChange(e) {
    if(e.hasChanged("status") && e.get("status") !== 1){
      this.$initial.hide();
      this.logger(e.get("title") || document.title);
    }
    // 数据加载完成
  },

  initShare(stateModel) {
    mallWechat.initShare({
      wechatshare: stateModel.wechatshare,
      title: stateModel.get("title") || document.title
    });
  },

  logger(title) {
    widget.updateViewTitle(title);
    menuLog({
      productid: this.groupId,
      title,
      from: parseUrl().from || "--"
    });
  }
});

new AppView();
