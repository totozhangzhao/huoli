var GoodsItem = require("app/client/mall/js/menu/models/goods-item.js");
var BaseGoods = require("app/client/common/collections/base-goods.js");
var Goods = BaseGoods.extend({
  model: GoodsItem
});

module.exports = Goods;