import Backbone from "backbone";

const Money = Backbone.Model.extend({
  defaults: {
    points: 0, // 积分
    money: 0,  // 钱（元）
    num: 0     // 购买数量
  }
});

export {Money};
export var money = new Money();
