import $ from "jquery";
import _ from "lodash";
import Promise from "com/mobile/lib/promise/npo.js";
import NativeAPI from "app/client/common/lib/native/native-api.js";
import {toast} from "com/mobile/widget/hint/hint.js";
import * as mallPromise from "app/client/mall/js/lib/mall-promise.js";
import {sendPost} from "app/client/mall/js/lib/mall-request.js";
import mallUitl from "app/client/mall/js/lib/util.js";
import ui from "app/client/mall/js/lib/ui.js";
import * as widget from "app/client/mall/js/lib/common.js";
import logger from "com/mobile/lib/log/log.js";
import StateModel from "app/client/mall/js/common/models/state.js";
import BaseView from "app/client/mall/js/common/views/BaseView.js";
import BannerView from "app/client/mall/js/home/views/banner.js";
import EntranceView from "app/client/mall/js/home/views/entrance.js";
import PromotionView from "app/client/mall/js/home/views/promotion.js";
import CategoryView from "app/client/mall/js/home/views/category.js";
import GoodsView from "app/client/mall/js/common/views/index-goods.js";
import Footer from "app/client/mall/js/common/views/footer.js";
import PointsView from "app/client/mall/js/home/views/points.js";
import PopoverAd from "app/client/mall/js/common/views/popover/popover-ad.js";

require("com/mobile/widget/button/back-to-top.js");

const AppView = BaseView.extend({
  el: "#main",

  events:{
    "click .js-new-page": "createNewPage",
    "click .js-get-url" : "handleGetUrl",
    "click .classify-item[state!=on]": "updateClassify" // 切换频道
  },

  initialize() {
    const title = mallUitl.isHangbanFunc() ? "航班商城" : "高铁商城";
    widget.updateViewTitle(title);

    this.$initial       = ui.initial().show();
    this.stateModel     = new StateModel();
    this.$footer        = new Footer();
    this.$bannerView    = new BannerView();
    this.$entranceView  = new EntranceView();
    this.$promotionView = new PromotionView();
    this.$categoryView  = new CategoryView({model: this.stateModel});
    this.$goodsView     = new GoodsView({model: this.stateModel, showLoading: true});
    this.$pointsView    = new PointsView();
    this.$popoverAdView = new PopoverAd({el: "#popover-ad"});
    this.listenTo(this.stateModel, "change:status", this.stateChange);

    this.bindEvents();
    this.fetchData();
    this.showCheckinBtn();
    logger.track(`${mallUitl.getAppName()}PV`, "View PV", title);
  },

  fetchData() {
    const self = this;

    mallPromise.getAppInfo(true)
    .then((userData) => new Promise((resolve, reject) => {
      sendPost("indexPageData", {p: userData.deviceInfo.p}, (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    }))
    .then(data => {
      self.render(data);
      NativeAPI.registerHandler("resume", () => {
        self.getUserInfo({ resume: true });
      });
    })
    .catch(mallPromise.catchFn);
  },

  render(data) {
    const self = this;
    this.$entranceView.render(data.topmenu || []);
    this.$promotionView.render(data.topgoods || []);
    this.$categoryView.render(data.menu || []);
    this.$goodsView.render(data.goods || []);
    this.$popoverAdView.fetch({position: 1});
    this.$footer.render();
    // this.initWarning();
    this.getUserInfo();
    setTimeout(() => {
      self.$initial.hide();
    }, 600);
    return this;
  },

  initWarning() {
    const $warning = require("app/client/mall/js/lib/warning.js").init("顶部提示信息");
    $warning.insertBefore("#home-banner");
  },

  getUserInfo() {
    const self = this;

    mallPromise.getAppInfo()
    .then(userData => {
      const params = _.extend({}, userData.userInfo, {
        p: userData.deviceInfo.p
      });

      sendPost("getUserInfo", params, (err, data) => {
        if(err){
          return;
        }

        self.$pointsView.render(data);
      });
    })
    .catch(mallPromise.catchFn);
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
  },

  stateChange(e) {
    if(e.get("status") !== 1){
      // 只有分类菜单fix状态时，才重置位置
      if(this.$categoryView.$el.hasClass('fix')){
        $(window).scrollTop(this.getFixTop() + 18);
      }
    }
  },

  bindEvents() {
    $(window).scroll(() => {
      const height = this.getFixTop();
      if($(window).scrollTop() > height){
        this.$categoryView.fix();
      }else{
        this.$categoryView.rel();
      }
    });
  },

  // 获取分类选择吸顶效果的top距离
  getFixTop() {
    return this.$goodsView.$el.get(0).offsetTop - this.$categoryView.$el.get(0).offsetHeight;
  }

});

new AppView();
