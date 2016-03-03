var GoodsItem = require("app/client/mall/js/list-page/grab/models/goods-item.js");
var BaseGoods = require("app/client/mall/common/collections/base-goods.js");
var Goods = BaseGoods.extend({
  model: GoodsItem
});

module.exports = Goods;