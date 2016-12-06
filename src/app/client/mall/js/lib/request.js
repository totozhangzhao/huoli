import jsonrpc from "jsonrpc";
import {BasicRequest} from "app/client/common/lib/http/http.js";
import {dispatch} from "app/client/mall/js/lib/mall-callback.js";
import UrlUtil from "com/mobile/lib/url/url.js";
import cookie from "com/mobile/lib/cookie/cookie.js";
import {config} from "app/client/mall/js/common/config.js";
import Util from "com/mobile/lib/util/util.js";

let tokenCache;
const idGenerator = (() => {
  let count = 0;
  return () => count += 1;
})();

const handlePayload = callback => (err, data) => {
  if (err) {
    return callback(err);
  }

  if (!data) {
    return callback(new Error("ES: 网络异常请稍后再试"));
  }

  data = jsonrpc.parse(data);

  switch (data.type) {
    case "success": {
      const result = data.payload.result;
      let token;
      if (Util.isObject(result) && !Util.isUndefined(result.token)) {
        token = result.token;
        if (token !== tokenCache) {
          tokenCache = token;
          cookie.set("token", token, config.mall.cookieOptions);
        }
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
  const basicRequest = new BasicRequest({
    url: options.url
  });

  return (method, params, callback) => {
    const urlObj = UrlUtil.parseUrlSearch();
    if (urlObj.hlfrom !== undefined) {
      params = params || {};
      params.hlfrom = urlObj.hlfrom;
    }
    const data    = jsonrpc.request(idGenerator(), method, params);
    const dataStr = JSON.stringify(data);
    const cb      = handlePayload(callback);
    basicRequest.request("POST", null, null, dataStr, cb);
  };
}
