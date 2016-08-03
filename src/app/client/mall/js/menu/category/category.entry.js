// 频道页
import * as mallPromise    from "app/client/mall/js/lib/mall-promise.js";
import {sendPost}     from "app/client/mall/js/lib/mall-request.js";
import * as mallUitl       from "app/client/mall/js/lib/util.js";
import UrlUtil        from "com/mobile/lib/url/url.js";
import * as mallWechat     from "app/client/mall/js/lib/wechat.js";

import * as widget    from "app/client/mall/js/lib/common.js";
import logger         from "com/mobile/lib/log/log.js";
import ui             from "app/client/mall/js/lib/ui.js";

import BaseView       from "app/client/mall/js/common/views/BaseView.js";
import BackTop from "com/mobile/widget/button/to-top.js";

import {initTracker}  from "app/client/mall/js/lib/common.js";
const categoryLog = initTracker("category-list");
import Navigator from "app/client/mall/js/menu/header/navigator.js";

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

    this.$initial = ui.initial().show();
    this.fetch();
    logger.track(`${mallUitl.getAppName()}PV`, "View PV", document.title);

  },

  render() {

    mallWechat.initShare({
      wechatshare: this.result.wechatshare,
      title: this.result.title
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
  }

});

new AppView();

