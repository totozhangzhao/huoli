var Backbone = require("backbone");
var Address  = require("app/client/mall/js/detail-page/goods-detail/model/address.js");

var AddressList = Backbone.Collection.extend({
  model: Address
});

module.exports = AddressList;
