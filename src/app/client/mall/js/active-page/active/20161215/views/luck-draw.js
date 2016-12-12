/**
 * 抽奖页面
 */
import $ from "jquery";
import _ from "lodash";
import Backbone from "backbone";

import NativeAPI from "app/client/common/lib/native/native-api.js";
import * as mallUtil from "app/client/mall/js/lib/util.js";
import * as mallWechat from "app/client/mall/js/lib/wechat.js";
import wechatUtil from "com/mobile/widget/wechat-hack/util.js";
import {toast} from "com/mobile/widget/hint/hint.js";

import * as mallPromise from "app/client/mall/js/lib/mall-promise.js";
import {sendPost} from "app/client/mall/js/lib/mall-request.js";

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
    this.initShare();
  },

  render() {
    this.$el.html(template());
    return this;
  },

  resume() {
    this.render();
  },

  // 抽奖
  luckDraw() {
    mallPromise
      .checkLogin({loginPage: "/fe/app/client/mall/html/active-page/active/login.html"})
      .then(userData => {
        var params = _.extend({}, userData.userInfo, {
          p: userData.deviceInfo.p,
          productid: 421
        });
        return new Promise((resolve, reject) => {
          sendPost("createOrder", params, function(err, data) {
            if (err) {
              reject(err);
            } else {
              resolve(data);
            }
          });
        });
      })
      .then(data => {
        this.dispacther(data);
      })
      .catch(err => {
        mallPromise.catchFn(err);
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
    this.shareInfo = {
      title: "雷凌双擎与你一起回家",
      desc: "管家APP购买春运回家票，雷凌双擎带你迈出回家第一步",
      link: `${window.location.origin}/fe/app/client/mall/html/active-page/active/20161215.html`,
      img: "http://cdn.rsscc.cn/guanggao/img/mall/active/leiling/leiling-share.png"
    };
    if( !mallUtil.isAppFunc() ) {
      mallWechat.initShare({
        wechatshare: this.shareInfo,
        title: this.shareInfo.title
      });
    }
  },

  appShare() {
    if(mallUtil.isAppFunc()) {
      NativeAPI.invoke("sharePage", {
        title: this.shareInfo.title,
        desc: this.shareInfo.desc,
        link: this.shareInfo.link,
        imgUrl: this.shareInfo.img
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
      toast("请在微信中打开", 3000);
    }
  },

  // 显示说明
  showExplain() {
    $(".shade", this.$el).show();
  },

  hideExplain() {
    $(".shade", this.$el).hide();
  },

  closePage() {
    NativeAPI.invoke("closeAll");
  }
});

export default LuckDrawView;
