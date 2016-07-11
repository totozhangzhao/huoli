import $ from "jquery";
import _ from "lodash";
import NativeAPI from "app/client/common/lib/native/native-api.js";
import echo from "com/mobile/lib/echo/echo.js";
import * as mallUitl from "app/client/mall/js/lib/util.js";
import logger from "com/mobile/lib/log/log.js";
import UrlUtil from "com/mobile/lib/url/url.js";

window.jQuery = window.$ = $;

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

export let createNewView = _.debounce(options => {
  let url = options.url;

  if (url === "" || url === null || url === undefined) {
    return;
  }

  function separateHash(url) {
    let separateHash = url.split("#");

    if ( separateHash.length > 1 ) {
      return {
        url: separateHash[0],
        hash: `#${separateHash[1]}`
      };
    } else {
      return {
        url,
        hash: ""
      };
    }
  }

  let urlAndHash = separateHash(url);

  url = urlAndHash.url;

  let $cur = options.$el;

  if ( $cur && $cur.data() && /\/fe\//.test(url) ) {
    url = url.indexOf("?") >= 0 ? `${url}&` : `${url}?`;
    url = url + $.param( $cur.data() );
  }

  function passOnParam(key) {
    let urlObj = UrlUtil.parseUrlSearch();
    let val = urlObj[key];

    if (val !== undefined) {
      url = url.indexOf("?") >= 0 ? `${url}&` : `${url}?`;
      url = url + `${key}=${val}`;
    }
  }

  passOnParam("from");

  let hash = urlAndHash.hash;

  url = url + hash;

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
}, 1000, true);

export function createAView(e) {
  let $cur = $(e.currentTarget);
  let url = $cur.prop("href");
  let isEmpty = str => str === "" || str === null || str === undefined;

  if ( isEmpty(url) ) {
    url = $cur.data("href");

    if ( isEmpty(url) ) {
      return true;
    }
  }

  // <a href="tel:+6494461709">61709</a>
  if ( url.indexOf(":") !== -1 && !/http/.test(url) ) {
    return true;
  }

  e.preventDefault();

  createNewView({
    url: url,
    title: $cur.data("title"),
    $el: $cur
  });
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
    let category = `${mallUitl.getAppName()}-${tag}_${data.title}`;
    if (data.productid) {
      category += `_${data.productid}`;
    }
    logger.track(category, "View PV", data.from);
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
  let prefix = `${mallUitl.getAppName()}-ev-${window.document.title}`;
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

  logger.track(category, "EV click", urlObj.from || "--");
});
