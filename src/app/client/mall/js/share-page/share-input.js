// import $            from "jquery";
import _            from "lodash";
import Backbone     from "backbone";
import * as mallPromise  from "app/client/mall/js/lib/mall-promise.js";
import Promise      from "com/mobile/lib/promise/npo.js";

import {sendPost}             from "app/client/mall/js/lib/mall-request.js";
import * as widget            from "app/client/mall/js/lib/common.js";

import template from "app/client/mall/tpl/share/caimi.tpl";
var AppView = Backbone.View.extend({
  events: {
    "click button.js-click-caimi": "exchange"
  },

  initialize: function() {
    // this.initView();
  },

  exchange: function () {
    let self = this;
    mallPromise.getAppInfo()
    .then(function (userData) {
      var params = _.extend({}, userData.userInfo, {
        p: userData.deviceInfo.p,
        productid: 10000213
      });
      return new Promise(function(resolve, reject) {
        sendPost("createOrder", params, function(err, data) {
          if (err) {
            reject(err);
          } else {
            resolve(data);
          }
        });
      });
    })
    .then(function (data) {
      if(data.useurl){
        self.gotoNewView({
          url: data.useurl
        });
      }
    })
    .catch(function (err) {
      if( err.code === -3330) {
        mallPromise.login();
      }else{
        mallPromise.catchFn(err);
      }
    });
    // .catch(mallPromise.catchFn);
  },

  initView: function() {
    this.$el.html(template());
  },

  gotoNewView: function(options) {
    widget.createNewView(options);
  }
});

module.exports = AppView;


