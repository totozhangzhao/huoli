// 频道页
import * as mallPromise    from "app/client/mall/js/lib/mall-promise.js";
import {sendPost}     from "app/client/mall/js/lib/mall-request.js";
import * as mallUtil       from "app/client/mall/js/lib/util.js";
import UrlUtil        from "com/mobile/lib/url/url.js";
import * as tplUtil from "app/client/mall/js/lib/mall-tpl.js";
import * as mallWechat     from "app/client/mall/js/lib/wechat.js";

import * as widget    from "app/client/mall/js/lib/common.js";
import logger         from "com/mobile/lib/log/log.js";
import ui             from "app/client/mall/js/lib/ui.js";
import NativeAPI from "app/client/common/lib/native/native-api.js";

import BaseView       from "app/client/mall/js/common/views/BaseView.js";
import BackTop from "com/mobile/widget/button/to-top.js";

import {initTracker}  from "app/client/mall/js/lib/common.js";
const categoryLog = initTracker("category-list");
import Navigator from "app/client/mall/js/common/views/header/navigator.js";
import MenuView from "app/client/mall/js/common/views/menu/menu.js";

const AppView = BaseView.extend({
  el: "#category-container",

  template: require("app/client/mall/tpl/menu/category/category-list.tpl"),

  events: {
    "click .js-new-page"    : "createNewPage",
    "click .js-get-url"     : "handleGetUrl"
  },

  initialize() {
    this.hideCheckinBtn();
    const nav = new Navigator();
    nav.render();
    this.menuView       = new MenuView({
      show: true,
      viewName: 'category'
    });
    new BackTop();

    this.$initial = ui.initial().show();
    this.fetch();
    logger.track(`${mallUtil.getAppName()}PV`, "View PV", document.title);

  },

  render() {
    mallWechat.initShare({
      wechatshare: this.result.wechatshare,
      title: this.result.title
    });
    this.$el.find("#category-list").html(this.template({
      data: this.result,
      tplUtil
    }));
    this.$el.append(this.menuView.el);
    mallWechat.initShare({
      wechatshare: this.result.wechatshare
    });
    return this;
  },

  fetch(){
    const params = {
      hasGoods: 0
    };
    const promise = new Promise((resolve, reject) => {
      sendPost("getClassifyList", params, (err, data) => {
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

      categoryLog({
        title: data.title || document.title,
        hlfrom: UrlUtil.parseUrlSearch().hlfrom || "--"
      });
    });
    promise.catch(mallPromise.catchFn);
  },

  // 隐藏右上角签到按钮
  hideCheckinBtn() {
    if ( !mallUtil.isHangbanFunc() ) {
      NativeAPI.invoke("updateHeaderRightBtn", {
        action: "hide",
        text: ""
      }, () => {
      });
    }
  }

});

new AppView();

