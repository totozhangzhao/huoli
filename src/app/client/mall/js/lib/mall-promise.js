import $ from "jquery";
import _ from "lodash";
import Promise from "com/mobile/lib/promise/npo.js";
import appInfo from "app/client/mall/js/lib/app-info.js";
import {toast} from "com/mobile/widget/hint/hint.js";
import NativeAPI from "app/client/common/lib/native/native-api.js";
import mallUitl from "app/client/mall/js/lib/util.js";
import {sendPost} from "app/client/mall/js/lib/mall-request.js";
import * as loginUtil from "app/client/mall/js/lib/login-util.js";

export function getAppInfo(reset) {
  return new Promise((resolve, reject) => {
    appInfo.getUserData((err, userData) => {
      if (err) {
        reject(err);
      } else {
        resolve(userData);
      }
    }, { reset: reset || false });
  });
}

export function catchFn(err) {
  if (err.message) {
    toast(err.message, 3000);
  } else {
    toast(JSON.stringify(err), 3000);
  }

  if (err instanceof Error) {
    window.console.log(`Error Message: \n${err.message}`);
    window.console.log(`Error Stack: \n${err.stack}`);
  }
}

export function order(orderParams) {
  return getAppInfo()
    .then(userData => {
      let params = _.extend({}, userData.userInfo, {
        p: userData.deviceInfo.p,
        productid: orderParams.productid
      }, orderParams);

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
    .catch(err => {
      if (err.code === -3331) {
        loginUtil.login({
          openid: orderParams.openid,
          pageUrl: window.location.href
        });
      } else {
        catchFn(err);
      }
    });
}

export function initPay(orderInfo) {
  function appPay(resolve, reject) {
    let payUrl = `${window.location.origin}/bmall/payview.do?orderid=${orderInfo.orderid}`;

    if ( mallUitl.isHangbanFunc() ) {
      payUrl = `${window.location.origin}/bmall/hbpayview.do?orderid=${orderInfo.orderid}`;
    }

    // quitpaymsg  String 退出时候的提示
    // title       String 支付标题
    // price       String 商品价格
    // orderid     String 订单号
    // productdesc String 商品描述
    // url         String 显示订单基本信息的Wap页面
    // subdesc     String 商品详情描述
    let payParams = {
      quitpaymsg: "您尚未完成支付，如现在退出，可稍后进入“全部订单->订单详情”完成支付。确认退出吗？",
      title: "支付订单",
      price: orderInfo.payprice,
      orderid: orderInfo.payorderid,
      productdesc: orderInfo.paydesc,
      url: payUrl,
      subdesc: orderInfo.paysubdesc
    };

    NativeAPI.invoke("startPay", payParams, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  }

  // https://wtest.133.cn/hangban/payment/new?orderId=160641436842465&orderType=2
  function webPay() {
    let baseUrl = "//wtest.133.cn/hangban/payment/new?";
    let params = {
      token: orderInfo.token,
      ru: orderInfo.returnUrl,
      orderId: orderInfo.payorderid,
      ptOrderId: orderInfo.orderid,
      orderType: 2
    };
    window.location.href = baseUrl + $.param(params);
  }

  return new Promise(mallUitl.isAppFunc() ? appPay : webPay);
}
