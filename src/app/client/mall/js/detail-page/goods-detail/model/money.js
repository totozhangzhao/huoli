var Backbone = require("backbone");

var Money = Backbone.Model.extend({
  defaults: {
    points: 0, // 积分
    money: 0,  // 钱（元）
    num: 0     // 购买数量
  }
});

exports.Money = Money;
exports.money = new Money();
