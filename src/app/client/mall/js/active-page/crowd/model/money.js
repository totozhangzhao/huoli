var Backbone = require("backbone");

var Money = Backbone.Model.extend({
  defaults: {
    needPay: 0
  }
});

exports.Money = Money;
exports.money = new Money();
