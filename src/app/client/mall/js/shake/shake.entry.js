// import $                        from "jquery";
import _                        from "lodash";
import Backbone                 from "backbone";
import * as mallPromise              from "app/client/mall/js/lib/mall-promise.js";
import Promise                  from "com/mobile/lib/promise/npo.js";

import {sendPost}               from "app/client/mall/js/lib/mall-request.js";
import * as widget              from "app/client/mall/js/lib/common.js";

import {parseUrlSearch as parseUrl}   from "com/mobile/lib/url/url.js";
import Shake                          from "com/mobile/widget/shake/shake.js";
import ui                             from "app/client/mall/js/lib/ui.js";
import Popover                from "com/mobile/widget/popover/popover.js";

import * as loginUtil         from "app/client/mall/js/lib/login-util.js";

const AppView = Backbone.View.extend({
  el: "#shake-main",

  events: {
    "click .audio-toggle": "audioToggle"
  },

  initialize() {
    this.$initial = ui.initial().show();
    this.alert = new Popover({
      type: "alert",
      title: "",
      message: "",
      agreeText: "",
      agreeFunc: this.toUse.bind(this)
    });
    // let btn = $("<button class='audio-toggle' style='position: fixed;width:80%; height:50px;border: 1px solid;left: 10%;top:0;'>测试按钮</div>");
    // this.$el.append(btn);
    this.shake = new Shake(this.shakeHandler.bind(this), {});
    this.$initial.hide();
  },

  shakeHandler() {
    const self = this;
    mallPromise.getAppInfo()
    .then(userData => {
      var params = _.extend({}, userData.userInfo, {
        p: userData.deviceInfo.p,
        productid: parseUrl().productid
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
      self.dispacther(data);
    })
    .catch(err => {
      if( err.code === -3330) {
        loginUtil.login();
      }else{
        mallPromise.catchFn(err);
      }
    });
  },

  // bonus:
  // 0: 没有中奖
  // 1: 普通奖品
  // 2: 转入订单详情
  // 3: 转入商品详情
  // 4: 转入商品详情输入页（金融类）
  dispacther(data) {

    this.nextUrl = null;
    let title = "恭喜中奖";
    const message = data.result.text;
    let buttonText = data.result.buttonText;
    switch ( data.bonus ) {
      case 0:
        title = "提示消息";
        buttonText = data.result.buttonText || "再接再厉";
        break;
      case 1:
        buttonText = data.result.buttonText || "确定";
        break;
      case 2:
        this.nextUrl = window.location.origin +
          "/fe/app/client/mall/html/detail-page/order-detail.html" +
          "?orderid=" + data.orderid;
        break;
      case 3:
        this.nextUrl = window.location.origin +
          "/fe/app/client/mall/html/detail-page/goods-detail.html" +
          "?productid=" + data.productid;
        break;
      case 4:
        this.nextUrl = window.location.origin +
          "/fe/app/client/mall/html/detail-page/goods-detail.html" +
          "?productid=" + data.productid +
          "&gotoView=form-phone";
        break;
    }
    this.alert.model.set({
      title: title,
      message:  message,
      agreeText: buttonText
    });
    this.alert.show();
  },

  toUse() {
    if(this.nextUrl) {
      widget.createNewView({ url: this.nextUrl });
    }
  },

  audioToggle() {
    if(this.shake.togglePlay()) {
      // can play
      window.console.log("canplay");
    }else {
      window.console.log("cantplay");
    }
  },

  gotoNewView(options) {
    widget.createNewView(options);
  }

});
new AppView();
