// 微信送礼 收礼页面
import $ from "jquery";
import _ from "lodash";
// import giftConfig from "app/client/mall/js/common/gift-config.js";
import * as tplUtil from "app/client/mall/js/lib/mall-tpl.js";
import * as mallPromise    from "app/client/mall/js/lib/mall-promise.js";
import {sendPost}     from "app/client/mall/js/lib/mall-request.js";
import * as mallUtil       from "app/client/mall/js/lib/util.js";
import UrlUtil        from "com/mobile/lib/url/url.js";
import * as loginUtil   from "app/client/mall/js/lib/login-util.js";
import wechatUtil from "com/mobile/widget/wechat-hack/util.js";
import * as mallWechat     from "app/client/mall/js/lib/wechat.js";
import cookie from "com/mobile/lib/cookie/cookie.js";
import * as widget    from "app/client/mall/js/lib/common.js";
import logger         from "com/mobile/lib/log/log.js";
import ui             from "app/client/mall/js/lib/ui.js";
import {toast} from "com/mobile/widget/hint/hint.js";
import hint from "com/mobile/widget/hint/hint.js";
import {config} from "app/client/mall/js/common/config.js";

// Views

// var Footer        = require("app/client/mall/js/common/views/footer.js");
import BaseView       from "app/client/mall/js/common/views/BaseView.js";
import template from "app/client/mall/tpl/gift/index.tpl";
const defaultTitle = "微信送礼";
const IndexView = BaseView.extend({

  el: "#index",

  events: {
    "click .js-new-page": "createNewPage",
    "click .js-get-url" : "handleGetUrl",
    "click [data-target-view]": "changeView",
    "click [data-target-hanlder]": "hanlder",
    "click [data-to-view]": "gotoPage"
  },

  initialize(commonData) {
    _.extend(this, commonData);
    this.$initial = ui.initial().show();
    this.urlObj = UrlUtil.parseUrlSearch();
    this.giftId = this.urlObj.giftId;
    logger.track(`${mallUtil.getAppName()}PV`, "View PV", defaultTitle);
  },

  getToken() {
    let oldWechatKey = cookie.get("giftWechatKey");
    if ( wechatUtil.isWechatFunc() ) {
      if(!this.urlObj.wechatKey || this.urlObj.wechatKey == oldWechatKey) {
        let returnUrl = `${document.location.origin}/fe/app/client/mall/html/gift/receive.html?giftId=${this.giftId}`;
        return window.location.href = loginUtil.getWechatAuthUrl(returnUrl);
      } else {
        cookie.set("giftWechatKey", this.urlObj.wechatKey, config.mall.cookieOptions);
        loginUtil
        .getTokenByWeChatKey(this.urlObj.wechatKey)
        .then(data => {
          return new Promise((resolve, reject) => {
            if (data.token) {
              resolve();
            } else if(data.tempkey){
              cookie.set("token", data.tempkey, config.mall.cookieOptions);
              resolve();
            } else {
              reject();
            }
          });
        })
        .then(() => {
          this.fetchData();
        })
        .catch(err => {
          if( err.code === -804 ) {
            cookie.set("giftWechatKey", this.urlObj.wechatKey, config.mall.cookieOptions);
            return this.getToken();
          }
          mallPromise.catchFn(err);
          // this.render();
        });
      }
    } else {
      toast("请在微信中打开", 4000);
    }
  },

  render() {
    this.$initial.hide();
    this.$el.html(template({
      data: this.result
    }));
    // 设置分享信息
    let shareInfo = {
      title: this.result.detail.wechatshare.title || defaultTitle,
      desc: this.result.detail.wechatshare.desc,
      img: this.result.detail.img,
      link: `${document.location.origin}/fe/app/client/mall/html/gift/receive.html?giftId=${this.giftId}`
    };
    if( this.result.status > 2 ) {
      // shareInfo = {};
    }
    mallWechat.initShare({
      wechatshare: shareInfo,
      title: this.result.detail.wechatshare.title || defaultTitle
    });
    widget.updateViewTitle(this.result.title || defaultTitle);
    return this;
  },

  resume() {
    this.getToken();
  },

  fetchData(){
    const params = {
      orderid: this.giftId
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
      this.render();
    });
    promise.catch(mallPromise.catchFn);
  },

  changeView(e) {
    let target = $(e.currentTarget).data("targetView");
    this.router.switchTo(target);
  },

  /*
    home 首页
   */
  gotoPage(e) {
    let pageName = $(e.currentTarget).data("toView");
    let url = "";
    switch(pageName) {
      case "home":
        url = `${document.location.origin}/fe/app/client/mall/index.html`;
        break;
      case "group":
        url = `${tplUtil.getBlockUrl({action: 8})}?groupId=${this.result.detail.groupId}&firstProductid=${this.result.detail.productid}`;
        break;
    }
    widget.createNewView({ url });
  },

  hanlder() {
    // let target = $(e.currentTarget).data("targetHanlder");
    // switch(target) {
    //   case "receive":
    //     // 券码类
    //     this.receiveGift();
    //     break;
    // }
    this.receiveGift();
  },

  // 收取礼物
  receiveGift() {
    hint.showLoading();
    const params = {
      orderid: this.giftId
    };
    let promise = new Promise((resolve, reject) => {
      sendPost("createGiftOrder", params, (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });

    });
    promise.then((data => {
      hint.hideLoading();
      toast(data.msg, 1000);
      if(data.status === 0) {
        this.router.replaceTo("index");
      } else if(data.status === 1) {
        this.router.replaceTo("info");
      }
    }));
    promise.catch(mallPromise.catchFn);
  }

});

export default IndexView;
