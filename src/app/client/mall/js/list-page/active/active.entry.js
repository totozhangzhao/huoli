import $ from "jquery";
import _ from "lodash";
import * as mallPromise    from "app/client/mall/js/lib/mall-promise.js";
import {sendPost}     from "app/client/mall/js/lib/mall-request.js";
import * as mallUtil       from "app/client/mall/js/lib/util.js";
import UrlUtil        from "com/mobile/lib/url/url.js";
import * as mallWechat     from "app/client/mall/js/lib/wechat.js";

import * as widget    from "app/client/mall/js/lib/common.js";
import logger         from "com/mobile/lib/log/log.js";
import ui             from "app/client/mall/js/lib/ui.js";

// Views
// 单个大图
import FullImageView  from "app/client/mall/js/list-page/active/views/full-image-view.js";
// 单个小图
import ImageView      from "app/client/mall/js/list-page/active/views/image-view.js";
// 文字
import ParagraphView  from "app/client/mall/js/list-page/active/views/paragraph-view.js";
// 标题
import TitleView      from "app/client/mall/js/list-page/active/views/title-view.js";
// 商品组
// 单列
import GroupSingleView from "app/client/mall/js/list-page/active/views/group-single-view.js";
// 多列
import GroupMutiView  from "app/client/mall/js/list-page/active/views/group-muti-view.js";
// 单个商品
import GoodsView      from "app/client/mall/js/list-page/active/views/goods-view.js";
// 优惠券
import CouponView     from "app/client/mall/js/list-page/active/views/coupon-view.js";
// 带标题和副标题的大图
import SubtitleImage     from "app/client/mall/js/list-page/active/views/subtitle-image.js";
// 空白
import BlankLineView  from "app/client/mall/js/list-page/active/views/blank-line-view.js";

import BaseView       from "app/client/mall/js/common/views/BaseView.js";
import {initTracker}  from "app/client/mall/js/lib/common.js";
import BackTop from "com/mobile/widget/button/to-top.js";
const activeListLog = initTracker("activeList");
import Navigator from "app/client/mall/js/common/views/header/navigator.js";
import MenuView from "app/client/mall/js/common/views/menu/menu.js";
const AppView = BaseView.extend({
  el: "#active-container",

  events: {
    "click .js-new-page": "createNewPage",
    "click .js-get-url" : "handleGetUrl"
  },

  initialize() {
    // type 视图组件 映射
    this.ViewMap = {
      1: FullImageView,
      2: ImageView,
      3: ParagraphView,
      4: TitleView,
      5: GroupSingleView,
      6: GroupMutiView,
      7: GoodsView,
      8: CouponView,
      10: SubtitleImage,
      9: BlankLineView
    };
    this.$initial = ui.initial().show();
    const nav = new Navigator();
    nav.render();
    new BackTop();
    this.activeId = UrlUtil.parseUrlSearch().groupId;
    if(String(UrlUtil.parseUrlSearch().showMenu) === "true" ) {
      this.showMenu();
      this.$el.append($('<div class="no-more-tip">到底啦！没有更多了~</div>'));
    }
    this.fetchData();
    logger.track(`${mallUtil.getAppName()}PV`, "View PV", document.title);
  },

  render() {
    this.$el.css({
      backgroundColor: this.result.backcolor
    });
    _.forEachRight(this.result.groups, (item) => {
      let View = this.ViewMap[item.type];
      if(View) {
        let ui = new View({model: item});
        this.$el.prepend(ui.render().el);
        if(ui.resizeImg) {
          ui.resizeImg();
        }
      }
    });
    mallWechat.initShare({
      wechatshare: this.result.wechatshare,
      title: this.result.title,
      useAppShare: true
    });
    return this;
  },

  fetchData(){
    const params = {
      activeid: this.activeId
    };
    const promise = new Promise((resolve, reject) => {
      sendPost("getActive", params, (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
    promise.then(data => {
      this.result = data;
      this.$initial.hide();
      this.render();
      widget.updateViewTitle(data.title || document.title);

      activeListLog({
        title: data.title || document.title,
        hlfrom: UrlUtil.parseUrlSearch().hlfrom || "--"
      });
    });
    promise.catch(mallPromise.catchFn);
  },

  showMenu() {
    this.menuView       = new MenuView({
      show: true,
      viewName: 'topic'
    });
    this.$el.append(this.menuView.el);
    this.$el.addClass("common-padding");
  }

});

new AppView();
