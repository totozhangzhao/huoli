import $            from "jquery";
import _            from "lodash";
import Backbone     from "backbone";
import mallPromise  from "app/client/mall/js/lib/mall-promise.js";
import Promise      from "com/mobile/lib/promise/npo.js";

import async                  from "async";
import {sendPost}             from "app/client/mall/js/lib/mall-request.js";
import {toast}                from "com/mobile/widget/hint/hint.js";
import NativeAPI              from "app/client/common/lib/native/native-api.js";
import * as widget            from "app/client/mall/js/lib/common.js";


var AppView = Backbone.View.extend({
  events: {
    "click button.js-click-caimi": "exchange"
  },
  initialize: function() {
    let btn = $("<button class='js-click-caimi' style='border: 1px solid;margin: 20px;'>测试按钮</div>");
    this.$el.html(btn);
  },

  exchange: function () {
    let self = this;
    mallPromise.getAppInfo()
    .then(function (userData) {
      var params = _.extend({}, userData.userInfo, {
        p: userData.deviceInfo.p,
        productid: 280
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
        self.loginApp();
      }else{
        mallPromise.catchFn(err);
      }
    });
    // .catch(mallPromise.catchFn);
  },

  initView: function() {

  },

  gotoNewView: function(options) {
    widget.createNewView(options);
  },
  loginApp: function() {
    async.waterfall([
      function(next) {

        // window.location.href = "gtgj://?type=gtlogin&bindflag=1&callback=" +
        //   window.btoa(unescape(encodeURIComponent( window.location.href )));

        NativeAPI.invoke("login", null, function(err, data) {
          next(err, data);
        });
      }
    ], function(err, result) {
      if (err) {
        toast(err.message, 1500);
        return;
      }

      if ( String(result.succ) === "1" || result.value === result.SUCC ) {
        window.location.reload();
      } else {
        // hint.hideLoading();
        window.console.log(JSON.stringify(result));
        NativeAPI.invoke("close");
      }
    });
  }
});

module.exports = AppView;


