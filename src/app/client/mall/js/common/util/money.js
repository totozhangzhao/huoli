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
