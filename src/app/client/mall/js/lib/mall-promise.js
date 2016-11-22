import $ from "jquery";
import _ from "lodash";
import appInfo from "app/client/mall/js/lib/app-info.js";
import {toast} from "com/mobile/widget/hint/hint.js";
import NativeAPI from "app/client/common/lib/native/native-api.js";
import {sendPost} from "app/client/mall/js/lib/mall-request.js";
import cookie from "com/mobile/lib/cookie/cookie.js";
import * as mallUtil from "app/client/mall/js/lib/util.js";
import * as loginUtil from "app/client/mall/js/lib/login-util.js";
import {config} from "app/client/mall/js/common/config.js";

export function catchShowError(err) {
  if (err.message && !err.silent) {
    toast(err.message, 3000);
  } else if (!err.silent) {
    toast(JSON.stringify(err), 3000);
  }
  if (err.detail) {
    window.console.log(`Error Message: \n${err.message}`);
    window.console.log(`Error Detial: \n${err.detail}`);
  } else if (err instanceof Error) {
    window.console.log(`Error Message: \n${err.message}`);
    window.console.log(`Error Stack: \n${err.stack}`);
  } else {
    window.console.log(`Unknown Error Object: \n${JSON.stringify(err)}`);
  }
  return err;
}

export function catchFn(err) {
  if (err.code === -3330) {
    loginUtil.login();
  } else if (err.code === -3331) {
    cookie.remove("token", config.mall.cookieOptions);
    loginUtil.login();
  } else {
    catchShowError(err);
  }
}

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

export function checkLogin(opts) {
  function LoginError(message) {
    this.message = message || "ES: LoginError";
    this.name = "LoginError";
  }

  LoginError.prototype = new Error();
  LoginError.prototype.constructor = LoginError;

  return getAppInfo(opts && opts.reset)
    .then(userData => {
      if ( !mallUtil.isAppFunc() ) {
        userData.token = cookie.get("token");
      }
      return userData;
    })
    .then(userData => {
      if (userData.token || userData.userInfo.authcode) {
        return userData;
      } else {
        loginUtil.login();
        let err = new LoginError("ES: 没有登录");
        err.silent = true;
        throw err;
      }
    });
}

export function order(orderParams) {
  return checkLogin()
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
            data.token = userData.token;
            resolve(data);
          }
        });
      });
    });
}

export function initPay(orderInfo) {
  function appPay(resolve, reject) {
    let payUrl = `${window.location.origin}/bmall/payview.do?orderid=${orderInfo.orderid}`;

    if ( mallUtil.isHangbanFunc() ) {
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

  // Web Pay URL
  //
  // formal:
  // https://h5.133.cn/hangban/webpay
  //
  // formal test:
  // http://h5.133.cn/hangban-test/webpay
  //
  // test:
  // http://wtest.133.cn/hangban/webpay
  function webPay() {
    let isTestEnv = mallUtil.isTest || mallUtil.isDev;
    if (orderInfo.server === "test") {
      isTestEnv = true;
    }
    let baseUrl = "https://h5.133.cn/hangban/webpay";
    if (isTestEnv) {
      baseUrl = "http://wtest.133.cn/hangban/webpay";
    }
    let params = {
      token: orderInfo.token,
      ru: orderInfo.returnUrl,
      orderId: orderInfo.payorderid,
      ptOrderId: orderInfo.orderid,
      orderType: 2,
      partner: "shangcheng"
    };
    window.location.href = baseUrl + "?" + $.param(params);
  }

  return new Promise(mallUtil.isAppFunc() ? appPay : webPay);
}
