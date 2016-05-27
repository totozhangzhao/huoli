import $ from "jquery";
import * as mallPromise from "app/client/mall/js/lib/mall-promise.js";
import {sendPost}  from "app/client/mall/js/lib/mall-request.js";
import cookie      from "com/mobile/lib/cookie/cookie.js";

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

export function goLogin() {
  window.location.href = "/fe/app/client/mall/html/login/login.html";
}

export function login(opts) {
  let options = opts || {};
  new Promise((resovle, reject) => {
    let params = {
      phone: options.phone,
      code: options.captcha,
      openid: options.openid
    };

    sendPost("weixinLogin", params, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resovle(data);
      }
    });
  })
    .then(data => {
      const cookieConfig = {
        expires: 86400,
        domain: location.hostname,
        path: "/"
      };
      cookie.set("token", data.token, cookieConfig);
      cookie.set("points", data.points, cookieConfig);
      cookie.set("level", data.level, cookieConfig);
      cookie.set("phone", data.phone || opts.phone, cookieConfig);
    })
    .then(() => {
      window.location.replace(options.pageUrl || "/fe/app/client/mall/index.html");
    })
    .catch(err => {
      if (err.code === - 3330) {
        goLogin();
      } else {
        mallPromise.catchFn(err);
      }
    });
}
