// var $           = require("jquery");
import _           from "lodash";
import Backbone    from "backbone";
import {sendPost} from "app/client/mall/js/lib/mall-request.js";
import * as mallPromise from "app/client/mall/js/lib/mall-promise.js";
import NativeAPI from "app/client/common/lib/native/native-api.js";
import cookie from "com/mobile/lib/cookie/cookie.js";
import * as mallUtil from "app/client/mall/js/lib/util.js";
import pageAction  from "app/client/mall/js/lib/page-action.js";
import ui from "app/client/mall/js/lib/ui.js";
import * as widget    from "app/client/mall/js/lib/common.js";
// views
import MenuView from "app/client/mall/js/common/views/menu/menu.js";
// templates
import profileTpl from "app/client/mall/tpl/profile/profile.tpl";
import orderStatusTpl from "app/client/mall/tpl/profile/ui/order-status.tpl";
import crowdOrderStatusTpl from "app/client/mall/tpl/profile/ui/crowd-order-status.tpl";

const AppView = Backbone.View.extend({
  el: "#profile-index",

  events: {
    "click .js-new-page": "createNewPage",
    "click .js-to-coupons": "toCouponsList"
  },


  initialize(commonData) {
    _.extend(this, commonData);
    this.$initial = ui.initial().show();
    this.menuView = new MenuView({
      show: true,
      viewName: 'my'
    });
    this.fetchData();
    this.registerAppResume();
  },
  resume() {
    pageAction.hideRightButton();
    widget.updateViewTitle(this.$el.data("title"));
  },

  fetchData: function() {
    mallPromise.getAppInfo()
      .then((userData) => {
        var params = _.extend({}, userData.userInfo, {
          p: userData.deviceInfo.p
        });

        return new Promise((resolve, reject) => {
          sendPost("getUserInfo", params, (err, data) => {
            if (err) {
              this.$initial.hide();
              reject(err);
            } else {
              resolve({
                points: data.points,
                level: data.level,
                phone: userData.userInfo.phone || cookie.get("phone"),
                mallUtil
              });
            }
          });
        });
      })
      .then((data) => {
        this.render(data);
        this.getStatusData();
        this.$el.append(this.menuView.el);
      })
      .catch(mallPromise.catchFn);
  },

  getStatusData() {
    mallPromise.getAppInfo()
      .then((userData) => {
        let params = _.extend({}, userData.userInfo);
        return new Promise((resolve, reject) => {
          sendPost("getUserMallInfo", params, (err, data) => {
            if(err) {
              reject(err);
            }else{
              resolve(data);
            }
            this.$initial.hide();
          });
        });
      })
      .then((data) => {
        this.$el.find("#order-status").html(orderStatusTpl(data.mallOrder));
        this.$el.find("#crowd-order-status").html(crowdOrderStatusTpl(data.crowdOrder));
        this.$el.find('.coupons-num-box').html(data.coupon.validnum || 0);
      })
      .catch(mallPromise.catchFn);
  },

  render(data) {
    this.$el.html(profileTpl(data));
  },

  createNewPage(e) {
    e.preventDefault();
    widget.createAView(e);
  },

  registerAppResume() {
    // 1 app 缓存问题， 2 更新状态
    NativeAPI.registerHandler("resume", () => {
      window.location.reload();
    });
  },

  toCouponsList() {
    Backbone.history.navigate("coupon-list",{
      trigger: true,
      replace: false
    })
  }
});

export default AppView;
