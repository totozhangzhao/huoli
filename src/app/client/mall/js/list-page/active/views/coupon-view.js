import $ from "jquery";
import _ from "lodash";
import Backbone from "backbone";
import * as tplUtil from "app/client/mall/js/lib/mall-tpl.js";
import template from "app/client/mall/tpl/list-page/active/ui/coupon.tpl";
import * as mallPromise from "app/client/mall/js/lib/mall-promise.js";
import {sendPost} from "app/client/mall/js/lib/mall-request.js";
import {toast} from "com/mobile/widget/hint/hint.js";

const BlankLine = Backbone.View.extend({
  tagName: 'div',

  className: 'pic-coupon-bar',

  events: {
    'click [data-coupon-id]': 'getCoupon'
  },

  initialize() {

  },
  render() {
    this.$el.html(template({
      group: this.model,
      tplUtil
    }))
    .css({
      backgroundColor: this.model.backcolor
    });
    return this;
  },

  // 设置图片高度
  resizeImg() {
    let img = this.$el.find('.active-img');
    img.height(img.width()/this.model.goods[0].imgratio);
  },

  getCoupon(e) {
    let couponId = $(e.currentTarget).data("couponId");
    mallPromise
      .checkLogin()
      .then(userData => {
        const params = _.extend({}, userData.userInfo, {
          p: userData.deviceInfo.p,
          productid: couponId
        });
        return new Promise((resolve, reject) => {
          sendPost("getCoupon", params, (err, data) => {
            if(err) {
              reject(err);
            }else{
              resolve(data);
            }
          });
        });
      })
      .then((result) => {
        toast(result.message, 1500);
      })
      .catch(mallPromise.catchFn);
  }
});
export default BlankLine;
