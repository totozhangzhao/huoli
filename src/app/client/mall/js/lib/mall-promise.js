import $ from "jquery";
import Promise from "com/mobile/lib/promise/npo.js";
import appInfo from "app/client/mall/js/lib/app-info.js";
import {toast} from "com/mobile/widget/hint/hint.js";
import NativeAPI from "app/client/common/lib/native/native-api.js";
import mallUitl from "app/client/mall/js/lib/util.js";

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
    toast(err.message, 1500);
  } else {
    toast(JSON.stringify(err), 1500);
  }

  if (err instanceof Error) {
    window.console.log(`Error Message: \n${err.message}`);
    window.console.log(`Error Stack: \n${err.stack}`);
  }
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
    const payParams = {
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
      orderId: orderInfo.payorderid,
      orderType: 2,
      ru: orderInfo.returnUrl
    };
    window.location.href = baseUrl + $.param(params);
  }

  return new Promise(mallUitl.isAppFunc() ? appPay : webPay);
}

export function login() {
  return new Promise((resolve, reject) => {
    NativeAPI.invoke("login", null, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  })
    .then(result => {
      if ( String(result.succ) === "1" || result.value === result.SUCC ) {
        window.location.reload();
      } else {
        // hint.hideLoading();
        window.console.log(JSON.stringify(result));
        NativeAPI.invoke("close");
      }
    })
    .catch(err => {
      if (err.code === -32603) {
        window.console.log("go to login page……");
      } else {
        catchFn(err);
      }
    });
}
