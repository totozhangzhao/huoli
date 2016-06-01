import GoodsItem from "app/client/mall/js/list-page/grab/models/goods-item.js";
import BaseGoods from "app/client/mall/js/common/collections/base-goods.js";
const Goods = BaseGoods.extend({
  model: GoodsItem
});

export default Goods;
