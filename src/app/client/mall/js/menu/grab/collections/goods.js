import GoodsItem from "app/client/mall/js/menu/grab/models/goods-item.js";
import BaseGoods from "app/client/mall/js/common/collections/base-goods.js";
const Goods = BaseGoods.extend({
  model: GoodsItem
});

export default Goods;
