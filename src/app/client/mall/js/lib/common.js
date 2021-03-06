import $ from "jquery";
import _ from "lodash";
import NativeAPI from "app/client/common/lib/native/native-api.js";
import echo from "com/mobile/lib/echo/echo.js";
import * as mallUtil from "app/client/mall/js/lib/util.js";
import logger from "com/mobile/lib/log/log.js";
import UrlUtil from "com/mobile/lib/url/url.js";
import cookie from "com/mobile/lib/cookie/cookie.js";
import {config} from "app/client/mall/js/common/config.js";
import loadScript from "com/mobile/lib/load-script/load-script.js";
import {createUrl} from "app/client/mall/js/lib/common-util.js";

window.jQuery = window.$ = $;

function erudaFilter() {
  loadScript(`${window.location.origin}/fe/com/mobile/develop/eruda.bundle.js`, true);
}

if ( cookie.get(config.eruda.name) ) {
  erudaFilter();
}

export function initRem() {
  let docEl = document.documentElement;
  let setRoot = () => {
    docEl.style.fontSize = `${docEl.clientWidth / 10}px`;
  };
  setRoot();
  let resizeEvent = "orientationchange" in window ? "orientationchange" : "resize";
  window.addEventListener(resizeEvent, _.debounce(setRoot, 150), false);
}

initRem();

export const createNewView = _.debounce(options => {
  const url = createUrl(options);

  if (options._webPageRedirect) {
    window.location.href = url;
  } else if (options._webPageReplace) {
    window.location.replace(url);
  } else {
    NativeAPI.invoke("createWebView", {
      url,
      controls: [
        {
          type: options.type || "title",
          text: options.title || ""
        }
      ]
    }, err => {
      if ( err && (err.code === -32603) ) {
        window.location.href = url;
      }
    });
  }
}, 1000, { leading: true });

export function createAView(e) {
  let $cur = $(e.currentTarget);
  let url = $cur.prop("href");
  let isEmpty = str => str === "" || str === null || str === undefined;

  if ( isEmpty(url) ) {
    url = $cur.data("hlMallHref");

    if ( isEmpty(url) ) {
      return true;
    }
  }

  // <a href="tel:+6494461709">61709</a>
  if ( url.indexOf(":") !== -1 && !/http/.test(url) ) {
    return true;
  }

  e.preventDefault();

  let params = {
    url: url,
    title: $cur.data("title")
  };

  function getQueryObj(data) {
    let queryObj = {};
    Object.keys(data).forEach(item => {
      if ( !/^logMall|^hlMall/.test(item) ) {
        queryObj[item] = data[item];
      }
    });
    return queryObj;
  }

  let data = $cur.data();

  if ( /\/fe\//.test(url) ) {
    params.queryObj = getQueryObj(data);
  }

  if ( data.hlMallPageAction === "replace" ) {
    params._webPageReplace = true;
  }

  createNewView(params);
}

export function redirectPage(url) {
  let options = {
    _webPageRedirect: true,
    url
  };
  createNewView(options);
}

export function replacePage(url) {
  let options = {
    _webPageReplace: true,
    url
  };
  createNewView(options);
}

export function updateViewTitle (title){
  let doc = window.document;
  title = title || doc.title;
  doc.title = title;
  NativeAPI.invoke("updateTitle", {
    text: title
  });
}

export function imageDelay(options) {
  let config = _.extend({
    offset: 250,
    throttle: 250,
    unload: false,
    callback(elem) {
      let $elem = $(elem);

      if ( !$elem.hasClass("op0") ) {
        return;
      }

      if ( $elem.is("img") ) {
        $elem.on("load", () => {
          setTimeout(() => {
            $elem.addClass("op1");
          }, 150);
        });
      } else {
        setTimeout(() => {
          $elem.addClass("op1");
        }, 150);
      }
    }
  }, options || {});

  echo.init(config);
}

/**
 * 数据统计
 *
 * 格式：
 * 页面类型_页面标题_产品ID，即 XXX_XXX_ID
 */

/**
 * 示例：
 * gtgj-detail_Jeep男士钱包优惠券_1000901
 * gtgj-detail_[第15期]IPhone6s Plus_1100259
 */
export function initTracker(tag) {
  return data => {
    let category = `${mallUtil.getAppName()}-${tag}_${data.title}`;
    if (data.productid) {
      category += `_${data.productid}`;
    }
    logger.track(category, "View PV", data.hlfrom);
  };
}

/**
 * 示例：
 * gtgj-ev-高铁商城-index-entrance_积分兑换
 * gtgj-ev-高铁商城-index-entrance_再玩一次-1000907
 * gtgj-ev-御泥坊刮刮卡_再玩一次_1000907
 */
$("body").on("click", "a, button, [data-log-mall-click]", e => {
  let $cur = $(e.currentTarget);
  let prefix = `${mallUtil.getAppName()}-ev-${window.document.title}`;
  let category;

  if ( $cur.data("logMallClick") ) {
    category = `${prefix}-${$cur.data("logMallClick")}`;
    category = category.replace(/-$/, "");
  } else {
    category = $cur.data("title") || $cur.text() || $cur.val() || "btn";
    category = category.replace(/\r?\n|\r/g, "").replace(/\s+/g, " ").trim();
    category = `${prefix}_${category}`;
  }

  let urlObj = UrlUtil.parseUrlSearch();

  if ( "productid" in urlObj) {
    category = `${category}_${urlObj.productid}`;
  }

  logger.track(category, "EV click", urlObj.hlfrom || "--");
});
