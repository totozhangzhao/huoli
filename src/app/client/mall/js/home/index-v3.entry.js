// import $ from "jquery";
// import _ from "lodash";
import NativeAPI from "app/client/common/lib/native/native-api.js";
import {toast} from "com/mobile/widget/hint/hint.js";
import * as mallPromise from "app/client/mall/js/lib/mall-promise.js";
import {sendPost} from "app/client/mall/js/lib/mall-request.js";
import * as mallUitl from "app/client/mall/js/lib/util.js";
import ui from "app/client/mall/js/lib/ui.js";
import * as widget from "app/client/mall/js/lib/common.js";
import logger from "com/mobile/lib/log/log.js";
import BackTop from "com/mobile/widget/button/to-top.js";

import PopoverAd from "app/client/mall/js/common/views/popover/popover-ad.js";
import BannerView from "app/client/mall/js/home/views/v3/banner.js";
import TopMenuView from "app/client/mall/js/home/views/v3/topmenu.js";
import PromotionView from "app/client/mall/js/home/views/v3/promotion.js";
import ActiveView from "app/client/mall/js/home/views/v3/active.js";
import GoodsView from "app/client/mall/js/home/views/v3/goods.js";
import Footer from "app/client/mall/js/common/views/footer.js";
import Navigator from "app/client/mall/js/menu/header/navigator.js";
import MenuView from "app/client/mall/js/common/views/menu/menu.js";
import BaseView from "app/client/mall/js/common/views/BaseView.js";
import * as mallWechat from "app/client/mall/js/lib/wechat.js";
const AppView = BaseView.extend({
  el: "#main",

  events:{
    "click .js-new-page"    : "createNewPage",
    "click .js-get-url"     : "handleGetUrl"
  },

  initialize() {
    this.$initial       = ui.initial().show();
    new BackTop({isHome: true});
    const title = mallUitl.isHangbanFunc() ? "伙力·航班商城" : "伙力·高铁商城";
    widget.updateViewTitle(title);
    const nav = new Navigator();
    nav.render();
    this.bannerView     = new BannerView({el: "#home-banner"});
    this.topMenuView    = new TopMenuView({el: "#home-topmenu"});
    this.promotionView  = new PromotionView({el: "#home-promotion"});
    this.activeView     = new ActiveView({el: "#home-active"});
    this.goodsView      = new GoodsView({el: "#home-goods"});
    this.$popoverAdView = new PopoverAd({el: "#popover-ad"});
    this.$footer        = new Footer();
    this.menuView       = new MenuView({
      show: true,
      viewName: 'home'
    });
    this.fetch();
    this.showCheckinBtn();
    logger.track(`${mallUitl.getAppName()}PV`, "View PV", title);
  },

  fetch() {
    let p = new Promise((resolve, reject)=> {
      sendPost("indexData", {v: '3.0'}, (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
    p.then(data => {
      this.render(data);
      setTimeout(() => {
        this.$initial.hide();
      }, 600);
    })
    .catch(mallPromise.catchFn);
  },

  render(data) {
    this.bannerView.render(data.banners || []);
    this.topMenuView.render(data.topmenu || []);
    this.promotionView.render(data.promotions || []);
    this.activeView.render(data.actives || []);
    this.goodsView.render(data.goods || []);
    this.$footer.render();
    this.$el.append(this.menuView.el);
    this.$popoverAdView.fetch({position: 1});
    this.$el.find("#menu").show();
    // 渲染完成后，显示页面
    this.$el.removeClass('hidden');
    mallWechat.initShare({
      wechatshare: data.wechatshare
    });
  },

  // 显示签到按钮
  showCheckinBtn() {
    if ( !mallUitl.isHangbanFunc() ) {
      NativeAPI.invoke("updateHeaderRightBtn", {
        action: "show",
        text: "签到"
      }, err => {
        if (err) {
          if ( mallUitl.isAppFunc() ) {
            toast(err.message, 1500);
          } else {
            window.console.log(err.message);
          }
          return;
        }
      });

      NativeAPI.registerHandler("headerRightBtnClick", () => {
        widget.createNewView({
          // url: "https://jt.rsscc.com/gtgjwap/act/20150925/index.html"
          url: "https://dl.rsscc.cn/gtgj/wap/act/20160324_sign/index.html"
        });
        logger.track(`${mallUitl.getAppName()}-签到`, "click");
      });
    }
  }
});
new AppView();
