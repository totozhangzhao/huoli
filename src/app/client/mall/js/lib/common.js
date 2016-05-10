import $ from "jquery";
import _ from "lodash";
import NativeAPI from "app/client/common/lib/native/native-api.js";
import echo from "com/mobile/lib/echo/echo.js";
import mallUitl from "app/client/mall/js/lib/util.js";
import logger from "com/mobile/lib/log/log.js";
import UrlUtil from "com/mobile/lib/url/url.js";

export function initRem() {
  const docEl = document.documentElement;
  const setRoot = () => {
    docEl.style.fontSize = `${docEl.clientWidth / 10}px`;
  };
  setRoot();
  const resizeEvent = "orientationchange" in window ? "orientationchange" : "resize";
  window.addEventListener(resizeEvent, _.debounce(setRoot, 150), false);
}

initRem();

export function createAView(e) {
  const $cur = $(e.currentTarget);
  let url = $cur.prop("href");
  const isEmpty = str => str === "" || str === null || str === undefined;

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

  const separateHash = url.split("#");
  let hash = "";

  if ( separateHash.length > 1 ) {
    url = separateHash[0];
    hash = `#${separateHash[1]}`;
  }

  if ( $cur.data() && /\/fe\//.test(url) ) {
    url = url.indexOf("?") >= 0 ? `${url}&` : `${url}?`;
    url = url + $.param( $cur.data() );
  }

  exports.createNewView({
    url: url + hash,
    title: $cur.data("title")
  });
}

export var createNewView = _.debounce(options => {
  let url = options.url;

  if (url === "" || url === null || url === undefined) {
    return;
  }

  if ( url === decodeURI(url) ) {
    url = encodeURI(url);
  }

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
}, 1000, true);

export function updateViewTitle (title){
  const doc = window.document;
  title = title || doc.title;
  doc.title = title;
  NativeAPI.invoke("updateTitle", {
    text: title
  });
}

export function imageDelay(options) {
  const config = _.extend({
    offset: 250,
    throttle: 250,
    unload: false,
    callback(elem) {
      const $elem = $(elem);

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
  const $cur = $(e.currentTarget);
  const prefix = `${mallUitl.getAppName()}-ev-${window.document.title}`;
  let category;

  if ( $cur.data("logMallClick") ) {
    category = `${prefix}-${$cur.data("logMallClick")}`;
    category = category.replace(/-$/, "");
  } else {
    category = $cur.data("title") || $cur.text() || $cur.val() || "btn";
    category = category.replace(/\r?\n|\r/g, "").replace(/\s+/g, " ").trim();
    category = `${prefix}_${category}`;
  }

  const urlObj = UrlUtil.parseUrlSearch();

  if ( "productid" in urlObj) {
    category = `${category}_${urlObj.productid}`;
  }

  logger.track(category, "EV click", urlObj.from || "--");
});
