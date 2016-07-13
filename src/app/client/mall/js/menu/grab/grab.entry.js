import $ from "jquery";
import _ from "lodash";
import NativeAPI from "app/client/common/lib/native/native-api.js";
import * as mallPromise from "app/client/mall/js/lib/mall-promise.js";
import {sendPost} from "app/client/mall/js/lib/mall-request.js";
import * as mallUitl from "app/client/mall/js/lib/util.js";
import UrlUtil from "com/mobile/lib/url/url.js";
import ui from "app/client/mall/js/lib/ui.js";
import logger from "com/mobile/lib/log/log.js";
import {initTracker} from "app/client/mall/js/lib/common.js";
import GoodsItemView from "app/client/mall/js/menu/grab/views/goods-item.js";
import BannerView from "app/client/mall/js/menu/grab/views/banner.js";
import WinnerView from "app/client/mall/js/menu/grab/views/winner-label.js";
import Footer from "app/client/mall/js/common/views/footer.js";
import BaseView from "app/client/mall/js/common/views/BaseView.js";
import BackTop from "com/mobile/widget/button/to-top.js";
const menuLog = initTracker("menu");
import "app/client/mall/js/lib/common.js";
import Navigator from "app/client/mall/js/menu/header/navigator.js";
import * as mallWechat from "app/client/mall/js/lib/wechat.js";

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
    const self = this;

    this.$initial = ui.initial().show();

    logger.track(`${mallUitl.getAppName()}PV`, "View PV", document.title);

    this.id = UrlUtil.parseUrlSearch().productid;
    // 商品列表容器
    this.$goodsPannel = $("#goods-block", this.$el);
    this.goodsView = new GoodsItemView({el: this.$goodsPannel});
    this.$footer        = new Footer();
    // 商品数据集合
    // this.$goods = new Goods();
    // this.listenTo(this.$goods,"set",this.addGoodsItem);
    this.fetchData();

    NativeAPI.registerHandler("resume", () => {
      self.fetchData({ resume: true });
    });
  },

  fetchData(opts) {
    const self = this;
    const options = opts || {};

    mallPromise.getAppInfo()
    .then(userData => {
      const params = _.extend({}, userData.userInfo, {
        productid: self.id
      });
      return new Promise((resolve, reject) => {
        sendPost("crowdColumn", params, (err, data) => {
          if (err) {
            reject(err);
          } else {
            resolve(data);
          }
        });
      });
    })
    .then(data => {
      if (options.resume) {
        self.renderGoodsList(data.product);
      } else {
        self.render(data);
      }
      mallWechat.initShare({
        wechatshare: data.wechatshare
      });
    })
    .catch(mallPromise.catchFn);
  },

  render(data) {
    const self = this;

    this.initBanner(data.banner);
    this.initWinnerLabel(data.winner);
    // this.$goods.set(data.product);
    this.renderGoodsList(data.product);
    this.$footer.renderCrowd();

    setTimeout(() => {
      self.$initial.hide();
    }, 0);

    menuLog({
      title: window.document.title,
      from: UrlUtil.parseUrlSearch().from || "--"
    });
    return this;
  },

  // 增加一个商品视图
  addGoodsItem() {

    // var itemView = new GoodsItemView();
    // this.$goodsPannel.append(itemView.render(data).el);
  },

  // 加载商品列表
  renderGoodsList(data) {
    this.goodsView.render(data);
  },
  // 初始化banner
  initBanner(bannerData) {
    new BannerView({model: bannerData});
  },
  // 初始化获奖名单滚动显示条
  initWinnerLabel(winnerData) {
    new WinnerView({model: winnerData});
  }
});

new AppView();
