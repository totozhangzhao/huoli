/**
 * 抽奖页面
 */
import $ from "jquery";
import _ from "lodash";
import Backbone from "backbone";

import NativeAPI from "app/client/common/lib/native/native-api.js";
import * as mallUtil from "app/client/mall/js/lib/util.js";
import * as loginUtil from "app/client/mall/js/lib/login-util.js";
import * as mallWechat from "app/client/mall/js/lib/wechat.js";
import wechatUtil from "com/mobile/widget/wechat-hack/util.js";
import hint from "com/mobile/widget/hint/hint.js";

import * as mallPromise from "app/client/mall/js/lib/mall-promise.js";
import {sendPost} from "app/client/mall/js/lib/mall-request.js";

import {shareInfo} from "app/client/mall/js/active-page/active/20161215/utils/config.js";
import ShareTipView from "app/client/mall/js/common/ui/wechat-share-tip.js";

import template from "app/client/mall/tpl/active-page/active/20161215/luck-draw.tpl";
import resultTemplate from "app/client/mall/tpl/active-page/active/20161215/result.tpl";

const LuckDrawView = Backbone.View.extend({

  el: "#luck-draw",

  events: {
    "click .luck-draw": "luckDraw",
    "click .js-share": "appShare",
    "click .js-explain" : "showExplain",
    "click .close": "hideExplain",
    "click .js-close-page": "closePage"
  },

  initialize: function(commonData) {
    this.util = commonData;
  },

  render() {
    this.$el.html(template());
    return this;
  },

  resume() {
    this.render();
    this.initShare();
  },

  // 抽奖
  luckDraw() {
    const loginPage = "/fe/app/client/mall/html/active-page/active/login.html";
    hint.showLoading();
    mallPromise
      .checkLogin({loginPage})
      .then(userData => {
        var params = _.extend({}, userData.userInfo, {
          p: userData.deviceInfo.p,
          productid: 1001676
        });
        return new Promise((resolve, reject) => {
          sendPost("createOrder", params, function(err, data) {
            if (err) {
              reject(err);
            } else {
              resolve(data);
            }
            hint.hideLoading();
          });
        });
      })
      .then(data => {
        this.dispacther(data);
      })
      .catch(err => {
        if (err.code === -3330 || err.code === -3331) {
          loginUtil.login({loginPage});
        } else {
          mallPromise.catchFn(err);
        }
      });
  },

  // bonus:
  // 0: 没有中奖
  // 1: 普通奖品
  // 2: 转入订单详情
  // 3: 转入商品详情
  // 4: 转入商品详情输入页（金融类）
  dispacther(data) {
    switch( data.bonus) {
      case 0: // 没有资格
      case 101: // 北京免费
      case 102: // 广州免费
      case 103: // 专车优惠券
      case 104: // 已经领取过
        this.$el.html(resultTemplate({
          data,
          mallUtil
        }));
        break;
      default:
        break;
    }
  },

  initShare() {
    if( !mallUtil.isAppFunc() ) {
      mallWechat.initShare({
        wechatshare: shareInfo,
        title: shareInfo.title
      });
    }
  },

  appShare() {
    if(mallUtil.isAppFunc()) {
      NativeAPI.invoke("sharePage", {
        title: shareInfo.title,
        desc: shareInfo.desc,
        link: shareInfo.link,
        imgUrl: shareInfo.img
      }, (err) => {
        if (err) {
          window.console.log(err.message);
        }
      });
    } else if(wechatUtil.isWechatFunc()) {
      if(!this.shareTipView) {
        this.shareTipView = new ShareTipView({parentDom: 'body'});
        this.shareTipView.render();
      }
      this.shareTipView.show();
    } else {
      // 不是app也不是微信的情况
      hint.toast("请在微信中打开", 3000);
    }
  },

  // 显示说明
  showExplain(e) {
    let data = $(e.currentTarget).data();
    $(`.shade.${data.className}`, this.$el).show();
  },

  hideExplain() {
    $(".shade", this.$el).hide();
  },

  closePage() {
    NativeAPI.invoke("closeAll");
  }
});

export default LuckDrawView;
