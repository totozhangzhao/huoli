var Backbone = require("backbone");

var Money = Backbone.Model.extend({
  defaults: {
    points: 0,
    money: 0,
    num: 0
  }
});

exports.Money = Money;
exports.money = new Money();
