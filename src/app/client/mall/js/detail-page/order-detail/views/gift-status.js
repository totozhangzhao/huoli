// 订单详情页 送礼状态视图
// 赠言视图
// import $ from "jquery";
// import _ from "lodash";
import Backbone from "backbone";
import NativeAPI from "app/client/common/lib/native/native-api.js";
import giftConfig from "app/client/mall/js/common/gift-config.js";
import * as mallUitl from "app/client/mall/js/lib/util.js";
import * as mallWechat from "app/client/mall/js/lib/wechat.js";
import wechatUtil from "com/mobile/widget/wechat-hack/util.js";
import template from "app/client/mall/tpl/detail-page/gift/order-gift.tpl";
import * as widget from "app/client/mall/js/lib/common.js";
import ShareTipView from "app/client/mall/js/common/ui/wechat-share-tip.js";
import {toast} from "com/mobile/widget/hint/hint.js";
let AppView = Backbone.View.extend({

  el: "#gift-status-container",

  events: {
    "click .send .order-giving-btn": "gift",
    "click .again .order-giving-btn": "gotoGoodsDetail",
    "click .notice .order-giving-btn": "gift"
  },

  initialize(options) {
    this.orderDetail = options.orderDetail;
    this.shareInfo = {
      title: 'title',
      desc: '我精心准备了一份礼物，打开看看喜不喜欢？O(∩_∩)O~',
      img: 'http://cdn.rsscc.cn/guanggao/img/gaotie/gt-common-goods-1001217.png',
      link: 'http://www.baidu.com'
    };

    // 不在app内的情况 设置分享信息
    if(!mallUitl.isAppFunc()) {
      mallWechat.initShare({
        wechatshare: this.shareInfo,
        title: this.shareInfo.title
      });
    }
  },

  render(giftContent) {
    this.$el.html(template({
      giftConfig,
      giftContent
    }));
  },

  gift() {
    if(mallUitl.isAppFunc()) {
      NativeAPI.invoke("sharePage", {
        title: this.shareInfo.title,
        desc: this.shareInfo.desc,
        link: this.shareInfo.link,
        imgUrl: this.shareInfo.img
      }, (err, result) => {
        if (err) {
          window.console.log(err.message);
          return;
        }
        window.console.log(result);
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

  gotoGoodsDetail() {
    widget.createNewView({
      url: `${document.location.origin}/fe/app/client/mall/html/detail-page/goods-detail.html?productid=${this.orderDetail.productid}`
    });
  }

});

export default AppView;
