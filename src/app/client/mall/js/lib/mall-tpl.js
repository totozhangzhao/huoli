import BuyNumModel from "app/client/mall/js/common/models/buy-num-model.js";

const moneyModel = new BuyNumModel();

// payType: 2,                // int 支付类型：1积分 2现金 3 积分+钱
// number: 1,                 // 购买个数
// price: 0,                  // 价格单价
// currency: "￥",            // 价格单位
// points: 0,                 // 积分单价
// pointsUnit: "积分",         // 积分单位
export function getMoneyText(options = {}) {
  moneyModel.set(options);
  return moneyModel.getPPriceText();
}

export function getJsClass(item) {
  var jsClass = "js-new-page";

  if ( String(item.action) === "3" ) {
    jsClass = "js-get-url";
  }

  return jsClass;
}

export function getBlockUrl(item) {
  var urlMap = {
    "9": "/fe/app/client/mall/html/detail-page/goods-detail.html",
    "0": "/fe/app/client/mall/html/detail-page/goods-detail.html",
    "1": "/fe/app/client/mall/html/share-page/share.html",
    "4": "/fe/app/client/mall/html/active-page/scratch-card/main.html",
    // "5": "/fe/app/client/mall/html/menu/category.html",
    "6": "/fe/app/client/mall/html/active-page/crowd/main.html",
    "7": "/fe/app/client/mall/html/menu/grab.html",
    "8": "/fe/app/client/mall/html/list-page/category/list.html",
    "801": "/fe/app/client/mall/html/menu/category.html",   // 分类列表页
    "11": "/fe/app/client/mall/html/shake/shake.html",      // 摇一摇
    "10": "/fe/app/client/mall/html/list-page/active/list.html",   // 活动模版
    "41": "/fe/app/client/mall/html/shake/shake.html"    // 测试用action
  };
  var jsUrl;

  if ( String(item.action) === "2" ) {
    jsUrl = item.url;
  } else {

    /* jshint scripturl: true */
    jsUrl = urlMap[item.action] || "javascript:;";
  }

  return jsUrl;
}
