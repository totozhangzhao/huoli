// import $            from "jquery";
import _            from "lodash";
import Backbone     from "backbone";
import * as mallPromise  from "app/client/mall/js/lib/mall-promise.js";
import Promise      from "com/mobile/lib/promise/npo.js";

import {sendPost}             from "app/client/mall/js/lib/mall-request.js";
import * as widget            from "app/client/mall/js/lib/common.js";
import template               from "app/client/mall/tpl/share/caimi.tpl";
import Popover                from "com/mobile/widget/popover/popover.js";

const AppView = Backbone.View.extend({
  events: {
    "click button.js-click-caimi": "exchange"
  },

  initialize() {
    this.initView();
    this.alert = new Popover({
      type: "alert",
      title: "领取成功",
      message: "您成功领取15888元体验金优惠码",
      agreeText: "马上使用",
      agreeFunc() {
        window.console.log("alert: agree default ");
      }
    });
  },

  exchange() {
    const self = this;
    mallPromise.getAppInfo()
    .then(userData => {
      const params = _.extend({}, userData.userInfo, {
        p: userData.deviceInfo.p,
        productid: 10000213
      });
      return new Promise((resolve, reject) => {
        sendPost("createOrder", params, (err, data) => {
          if (err) {
            reject(err);
          } else {
            resolve(data);
          }
        });
      });
    })
    .then(data => {
      if(data.useurl){
        self.alert.model.set({agreeFunc() {
          self.gotoNewView({
            url: data.useurl
          });
        }});
        self.alert.show();
      }
    })
    .catch(err => {
      if( err.code === -3330) {
        mallPromise.login();
      }else{
        mallPromise.catchFn(err);
      }
    });
    // .catch(mallPromise.catchFn);
  },

  initView() {
    this.$el.html(template());
  },

  gotoNewView(options) {
    widget.createNewView(options);
  }
});

export default AppView;


