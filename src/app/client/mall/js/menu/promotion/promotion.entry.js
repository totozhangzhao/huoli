import * as mallPromise    from "app/client/mall/js/lib/mall-promise.js";
import {sendPost}     from "app/client/mall/js/lib/mall-request.js";
import mallUitl       from "app/client/mall/js/lib/util.js";
import UrlUtil        from "com/mobile/lib/url/url.js";
import loadScript     from "com/mobile/lib/load-script/load-script.js";
import shareUtil      from "com/mobile/widget/wechat/util.js";
import wechatUtil     from "com/mobile/widget/wechat-hack/util.js";
import * as mallWechat     from "app/client/mall/js/lib/wechat.js";

import * as widget    from "app/client/mall/js/lib/common.js";
import logger         from "com/mobile/lib/log/log.js";
import ui             from "app/client/mall/js/lib/ui.js";

// Views
import GroupListView  from "app/client/mall/js/menu/promotion/views/groups-view.js";
import BannerView     from "app/client/mall/js/menu/promotion/views/banner-view.js";
import RuleView       from "app/client/mall/js/menu/promotion/views/rule-view.js";
// var Footer        = require("app/client/mall/js/common/views/footer.js");
import BaseView       from "app/client/mall/js/common/views/BaseView.js";
import {initTracker}  from "app/client/mall/js/lib/common.js";
// import * as downloadUtil   from "app/client/mall/js/lib/download-app.js";
import BackTop from "com/mobile/widget/button/to-top.js";
const promotionLog = initTracker("active");


const AppView = BaseView.extend({
  el: "#main",

  events: {
    "click .js-new-page": "createNewPage",
    "click .js-get-url" : "handleGetUrl"
  },

  initialize() {
    new BackTop();
    this.activeId = UrlUtil.parseUrlSearch().groupId;

    this.bannerView = new BannerView();
    this.groupView  = new GroupListView();
    this.ruleView   = new RuleView();
    this.$initial = ui.initial().show();
    this.fetchData();
    logger.track(`${mallUitl.getAppName()}PV`, "View PV", document.title);

    const isApp = mallUitl.isAppFunc();

    if ( !isApp ) {
      require("app/client/mall/js/lib/download-app.js").init( isApp );
    }

  },

  render() {
    this.bannerView.render(this.result);
    this.groupView.render(this.result.groups);
    this.ruleView.render(this.result);

    if (this.result.wechatshare) {
      wechatUtil.setShareInfo(this.result.wechatshare);
    }
    if( shareUtil.hasShareInfo() ) {
      if( wechatUtil.isWechatFunc() ) {
        wechatUtil.setTitle(this.result.title);
        return loadScript(`${window.location.origin}/fe/com/mobile/widget/wechat/wechat.bundle.js`);
      }
      return mallWechat.initNativeShare();
    }

  },


  fetchData(){
    const self = this;
    const params = {
      activeid: self.activeId
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
      self.result = data;
      self.$initial.hide();
      self.render();
      widget.updateViewTitle(data.title || document.title);

      promotionLog({
        title: data.title || document.title,
        from: UrlUtil.parseUrlSearch().from || "--"
      });
    });
    promise.catch(mallPromise.catchFn);
  }

});

new AppView();
