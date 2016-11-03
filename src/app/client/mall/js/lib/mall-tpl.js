import BuyNumModel from "app/client/mall/js/common/models/buy-num-model.js";
import {urlMap} from "app/client/mall/js/common/config.js";

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

export function getMoneyTpl(options = {}) {
  moneyModel.set(options);
  return moneyModel.getPPriceTpl();
}

export function getJsClass(item) {
  let jsClass = "js-new-page";

  if ( String(item.action) === "3" ) {
    jsClass = "js-get-url";
  } else if ( String(item.action) === "-1" ) {
    jsClass = "";
  }

  return jsClass;
}

export function getBlockUrl(item) {
  let codeToName = {
    "9": "goods-detail",
    "0": "goods-detail",
    "1": "share-page",
    "4": "scratch-card",
    // "5": "category",
    "6": "crowd-detail",
    "7": "crowd-list",
    "8": "goods-category",
    "801": "category",        // 分类列表页
    "11": "shake-detail",     // 摇一摇
    "10": "active-list-page", // 活动模版
    "41": "test-action"       // 测试用action
  };
  let jsUrl;

  if ( String(item.action) === "2" ) {
    jsUrl = item.url;
  } else if(String(item.action) === "-1") {
    jsUrl = "javascript: void(0);";
  } else {
    const name = codeToName[item.action];
    /* jshint scripturl: true */
    jsUrl = (urlMap[name] && urlMap[name].url) || "javascript:void(0);";
  }

  return jsUrl;
}
