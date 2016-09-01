import {getMoneyText} from "app/client/mall/js/lib/mall-tpl.js";
import {expect} from "chai";

// getMoneyText
//
// payType: 2,                // int 支付类型：1积分 2现金 3 积分+钱
// number: 1,                 // 购买个数
// price: 0,                  // 价格单价
// currency: "￥",            // 价格单位
// points: 0,                 // 积分单价
// pointsUnit: "积分",         // 积分单位
describe("生成价格文案", () => {
  it("价格文案：积分", () => {
    expect(getMoneyText({
      payType: 1,
      price: 100,
      points: 100,
    })).to.be.equal("100积分");
  });

  it("价格文案：人民币", () => {
    expect(getMoneyText({
      payType: 2,
      price: 100,
      points: 100,
    })).to.be.equal("￥100.00");
  });

  it("价格文案：人民币+积分", () => {
    expect(getMoneyText({
      payType: 3,
      price: 100,
      points: 100,
    })).to.be.equal("￥100.00+100积分");
  });

  it("价格文案：人民币+积分（多份数量）", () => {
    expect(getMoneyText({
      payType: 3,
      number: 5,
      price: 100,
      points: 100,
    })).to.be.equal("￥500.00+500积分");
  });
});
