// var $           = require("jquery");
var _           = require("lodash");
var Backbone    = require("backbone");
var sendPost    = require("app/client/mall/js/lib/mall-request.js").sendPost;
var mallPromise = require("app/client/mall/js/lib/mall-promise.js");
var pageAction  = require("app/client/mall/js/lib/page-action.js");
var cookie      = require("com/mobile/lib/cookie/cookie.js");
var ui          = require("app/client/mall/js/lib/ui.js");
import * as widget    from "app/client/mall/js/lib/common.js";


var AppView = Backbone.View.extend({
  el: "#profile-index",
  initialize(commonData) {
    _.extend(this, commonData);
    this.$initial = ui.initial().show();
    this.fetchData();
  },
  resume() {
    pageAction.hideRightButton();
    widget.updateViewTitle(document.title);
  },
  fetchData() {
    mallPromise.getAppInfo()
      .then((userData) => {
        var params = _.extend({}, userData.userInfo, {
          p: userData.deviceInfo.p
        });

        return new Promise((resolve, reject) => {
          sendPost("getUserInfo", params, (err, data) => {
            if (err) {
              reject(err);
            } else {
              resolve({
                points: data.points,
                level: data.level,
                phone: userData.userInfo.phone || cookie.get("phone")
              });
            }
          });
        });
      })
      .then((data) => {
        this.render(data);
        this.updateCouponCount();
        this.$initial.hide();
      })
      .catch(mallPromise.catchFn);
  },

  updateCouponCount() {
    mallPromise.getAppInfo()
      .then((userData) => {
        let params = _.extend({}, userData.userInfo);
        return new Promise((resolve, reject) => {
          sendPost("getUserMallCoupon", params, (err, data) => {
            if(err) {
              reject(err);
            }else{
              resolve(data);
            }
          });
        });
      })
      .then((data) => {
        this.$el.find(".coupon-count-box")
          .removeClass('hidden')
          .find("b")
          .html(data.validnum || 0);
      })
      .catch(mallPromise.catchFn);
  },

  render(data) {
    var tmpl = require("app/client/mall/tpl/profile/user-level.tpl");
    this.$el.find(".js-top-container").html(tmpl(data));
  }
});

module.exports = AppView;
