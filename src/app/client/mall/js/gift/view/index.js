
// import _ from "lodash";
import * as mallPromise    from "app/client/mall/js/lib/mall-promise.js";
import {sendPost}     from "app/client/mall/js/lib/mall-request.js";
import * as mallUitl       from "app/client/mall/js/lib/util.js";
import UrlUtil        from "com/mobile/lib/url/url.js";
import * as loginUtil   from "app/client/mall/js/lib/login-util.js";
import * as mallWechat     from "app/client/mall/js/lib/wechat.js";
// import cookie from "com/mobile/lib/cookie/cookie.js";
import * as widget    from "app/client/mall/js/lib/common.js";
import logger         from "com/mobile/lib/log/log.js";
import ui             from "app/client/mall/js/lib/ui.js";

// Views

// var Footer        = require("app/client/mall/js/common/views/footer.js");
import BaseView       from "app/client/mall/js/common/views/BaseView.js";
import {initTracker}  from "app/client/mall/js/lib/common.js";
import BackTop from "com/mobile/widget/button/to-top.js";
const activeListLog = initTracker("activeList");

const IndexView = BaseView.extend({
  el: "#receive-container",

  events: {
    "click .js-new-page": "createNewPage",
    "click .js-get-url" : "handleGetUrl"
  },

  initialize() {
    this.$initial = ui.initial().show();
    new BackTop();
    this.urlObj = UrlUtil.parseUrlSearch();
    this.activeId = this.urlObj.groupId;
    this.giftId = this.urlObj.giftId;
    this.getToken();
    logger.track(`${mallUitl.getAppName()}PV`, "View PV", document.title);
  },

  getToken() {
    if ( loginUtil.shouldGetWeChatKey() ) {
      let curUrl = window.location.href;
      let returnUrl = curUrl.substring(0, curUrl.indexOf('.html') + 5 ) + '?giftId=' + this.giftId;
      return window.location.href = loginUtil.getWechatAuthUrl(returnUrl);
    } else if (this.urlObj.wechatKey) {
      loginUtil
        .getTokenByWeChatKey(this.urlObj.wechatKey)
        .then(data => {
          return new Promise((resolve, reject) => {
            if (data.token) {
              resolve(data.token);
            } else {
              reject();
            }
          });

        })
        .then(token => {
          this.fetchData(token);
        })
        .catch(err => {
          mallPromise.catchFn(err);
          // this.render();
        });
    } else {
      window.console.log("ES: 未获取到 wechatKey");
      this.$initial.hide();
      // this.render();
    }
  },

  render() {
    mallWechat.initShare({
      wechatshare: this.result.wechatshare,
      title: this.result.title,
      useAppShare: true
    });
    return this;
  },

  resume() {
    window.console.log('resumt');
  },

  fetchData(token){
    const params = {
      orderid: this.giftId,
      token: token
    };
    const promise = new Promise((resolve, reject) => {
      sendPost("showGift", params, (err, data) => {
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
    promise.catch((err) => {
      window.console.log(err);
      // mallPromise.catchFn
    });
  }

});

export default IndexView;
