import $ from "jquery";
import {parseUrlSearch as parseUrl} from "com/mobile/lib/url/url.js";
import cookie from "com/mobile/lib/cookie/cookie.js";

// touch status
((() => {
  let timeoutId;
  $("body")
    .on("touchstart", "a, .js-touch-state", function() {
      timeoutId = setTimeout(() => {
        $(this).addClass("touch");
      }, 50 + Math.round(Math.random() * 100));
    })
    .on("touchmove", "a, .js-touch-state", function() {
      clearTimeout(timeoutId);
      $(this).removeClass("touch");
    })
    .on("touchend", "a, .js-touch-state", function() {
      clearTimeout(timeoutId);
      $(this).removeClass("touch");
    })
    .on("touchcancel", "a, .js-touch-state", function() {
      clearTimeout(timeoutId);
      $(this).removeClass("touch");
    });
})());

export let isTest = /test.mall|test.hbmall|123.56.101.36/.test(window.location.hostname);

export let getAppName = (() => {
  let name = "gtgj";

  // mall.rsscc.cn
  // hbmall.rsscc.cn
  if ( /hb/.test(window.location.hostname) ) {
    name = "hbgj";
  }

  const urlName    = parseUrl().appName;
  const cookieName = cookie.get("appName");

  if (urlName) {
    name = urlName;
  }

  if (cookieName) {
    name = cookieName;
  }

  return () => name;
})();

export function isHangbanFunc() {
  return /hbgj/i.test(getAppName());
}

export function isAppFunc() {
  const appName = cookie.get("appName");

  if ( /gtgj|hbgj/i.test(appName) ) {
    return true;
  } else {
    return false;
  }
}

export function getHangbanAppUrl() {
  return "http://a.app.qq.com/o/simple.jsp?pkgname=com.flightmanager.view";
}

export function getGaotieAppUrl() {
  return "http://a.app.qq.com/o/simple.jsp?pkgname=com.gtgj.view";
}

export function getUpgradeUrl() {
  return "http://cdn.rsscc.cn/guanggao/upgrade/upgrade.html";
}
