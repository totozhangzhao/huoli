import jsonrpc from "jsonrpc";
import {BasicRequest} from "app/client/common/lib/http/http.js";
import {dispatch} from "app/client/mall/js/lib/mall-callback.js";
import UrlUtil from "com/mobile/lib/url/url.js";
import cookie from "com/mobile/lib/cookie/cookie.js";

let idGenerator = (() => {
  let count = 0;
  return () => count += 1;
})();

let callbackWraper = callback => (err, data) => {
  if (err) {
    return callback(err);
  }

  if (!data) {
    return callback(new Error("网络异常请稍后再试"));
  }

  data = jsonrpc.parse(data);

  switch (data.type) {
    case "success": {
      let result = data.payload.result;
      let token = data.payload.token || result.token;
      if (token) {
        let cookieConfig = {
          expires: 86400,
          domain: location.hostname,
          path: "/"
        };
        cookie.set("token", token, cookieConfig);
      }
      callback(null, result);
      dispatch(result);
      break;
    }
    case "error":
      callback(data.payload.error);
      break;
    default:
      callback(data.payload);
  }
};

export function createSendPost(options) {
  let basicRequest = new BasicRequest({
    url: options.url
  });

  return (method, params, callback) => {
    let urlObj = UrlUtil.parseUrlSearch();
    if (urlObj.openid !== undefined) {
      params = params || {};
      params.openid = urlObj.openid;
    }
    if (urlObj.from !== undefined) {
      params = params || {};
      params.from = urlObj.from;
    }
    let data    = jsonrpc.request(idGenerator(), method, params);
    let dataStr = JSON.stringify(data);
    let cb      = callbackWraper(callback);
    basicRequest.request("POST", null, null, dataStr, cb);
  };
}
