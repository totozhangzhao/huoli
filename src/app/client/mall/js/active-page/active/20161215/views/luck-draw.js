/**
 * 抽奖页面
 */
// import $ from "jquery";
import _ from "lodash";
import Backbone from "backbone";

import * as mallPromise from "app/client/mall/js/lib/mall-promise.js";
import {sendPost} from "app/client/mall/js/lib/mall-request.js";

import template from "app/client/mall/tpl/active-page/active/20161215/luck-draw.tpl";
const LuckDrawView = Backbone.View.extend({

  el: "#luck-draw",

  events: {
    "click .luck-draw": "luckDraw"
  },

  initialize: function(commonData) {
    this.util = commonData;
  },

  render() {
    this.$el.html(template());

  },

  resume() {
    this.render();
  },

  // 抽奖
  luckDraw() {
    mallPromise
      .checkLogin()
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
      case 101:
        // 北京免费
        window.console.log("北京免费");
        break;
      case 102:
        // 广州免费
        window.console.log("广州免费");
        break;
      case 103:
        // 专车优惠券
        window.console.log("专车优惠券");
        break;
      case 104:
        // 已经领取过
        window.console.log("已经领取过");
        break;
    }
  }
});

export default LuckDrawView;
