import $ from "jquery";
import * as mallPromise from "app/client/mall/js/lib/mall-promise.js";
import {sendPost} from "app/client/mall/js/lib/mall-request.js";
import cookie from "com/mobile/lib/cookie/cookie.js";
import NativeAPI from "app/client/common/lib/native/native-api.js";
import * as mallUitl from "app/client/mall/js/lib/util.js";
import wechatUtil from "com/mobile/widget/wechat-hack/util.js";
import UrlUtil from "com/mobile/lib/url/url.js";
import * as widget from "app/client/mall/js/lib/common.js";

// wechatKey, auth
export function getWechatAuthUrl(pageUrl) {
  const authUrl = "http://wx.133.cn/hbrobot/wxoauth?" + $.param({
    pid: "602",
    ru: pageUrl || window.location.href
  });

  const wechatUrl = "https://open.weixin.qq.com/connect/oauth2/authorize?" + $.param({
    appid: "wxfd7a32d944c9b3f5",
    redirect_uri: authUrl,
    response_type: "code",
    scope: "snsapi_base",
    state: "STATE",
    connect_redirect: "1"
  }) + "#wechat_redirect";

  return wechatUrl;
}

export function shouldGetWeChatKey(token) {
  let urlObj = UrlUtil.parseUrlSearch();
  return wechatUtil.isWechatFunc() && !token && !urlObj.wechatKey && urlObj.auth === void 0;
}

function saveToken(data) {
  let cookieConfig = {
    expires: 86400,
    domain: location.hostname,
    path: "/"
  };
  cookie.set("token", data.token, cookieConfig);
  cookie.set("points", data.points, cookieConfig);
  cookie.set("level", data.level, cookieConfig);
  cookie.set("phone", data.phone, cookieConfig);
}

export function getTokenByWeChatKey(wechatKey) {
  return new Promise((resovle, reject) => {
    let params = {
      wechatKey: wechatKey
    };
    sendPost("getTokenByWeChatKey", params, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resovle(data);
      }
    });
  })
    .then(data => {
      saveToken(data);
      return data;
    });
}

export function loginRequset(opts) {
  let options = opts || {};
  return new Promise((resovle, reject) => {
    let params = {
      phone: options.phone,
      code: options.captcha,
      wechatKey: options.wechatKey
    };

    sendPost("webLogin", params, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resovle(data);
      }
    });
  })
    .then(data => {
      data.phone = data.phone || opts.phone;
      saveToken(data);
      return data;
    });
}

export function login() {
  function webLogin() {
    let url = `/fe/app/client/mall/html/login/login.html?ru=${encodeURIComponent(window.location.href)}`;
    return widget.redirectPage(url);
  }

  function appLogin() {
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
          webLogin();
        } else {
          mallPromise.catchFn(err);
        }
      });
  }

  return mallUitl.isAppFunc() ? appLogin() : webLogin();
}
