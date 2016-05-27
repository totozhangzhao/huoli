import $                        from "jquery";
import _                        from "lodash";
import Backbone                 from "backbone";
import * as mallPromise              from "app/client/mall/js/lib/mall-promise.js";
import Promise                  from "com/mobile/lib/promise/npo.js";

import {sendPost}               from "app/client/mall/js/lib/mall-request.js";
import * as widget              from "app/client/mall/js/lib/common.js";

import {parseUrlSearch as parseUrl}   from "com/mobile/lib/url/url.js";
import Shake                          from "com/mobile/widget/shake/shake.js";
import ui                             from "app/client/mall/js/lib/ui.js";

var AppView = Backbone.View.extend({
  el: "#shake-main",

  events: {
    "click .audio-toggle": "audioToggle"
  },

  initialize: function () {
    this.$initial = ui.initial().show();
    let btn = $("<button class='audio-toggle' style='position: fixed;width:80%; height:50px;border: 1px solid;left: 10%;top:0;'>测试按钮</div>");
    this.$el.append(btn);
    this.shake = new Shake(this.shakeHandler.bind(this), {});
    this.$initial.hide();
  },

  shakeHandler: function () {
    let self = this;
    mallPromise.getAppInfo()
    .then(function (userData) {
      var params = _.extend({}, userData.userInfo, {
        p: userData.deviceInfo.p,
        productid: parseUrl().productid
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
  },

  audioToggle: function () {
    if(this.shake.togglePlay()) {
      // can play
      window.console.log("canplay");
    }else {
      window.console.log("cantplay");
    }
  },

  gotoNewView: function(options) {
    widget.createNewView(options);
  }

});
new AppView();
