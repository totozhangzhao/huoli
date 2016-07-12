import GoodsView          from "app/client/mall/js/detail-page/goods-detail/view/goods-detail.js";
import DescView           from "app/client/mall/js/detail-page/goods-detail/view/goods-desc.js";
import OrderView          from "app/client/mall/js/detail-page/goods-detail/view/form-phone.js";
import FormCustomView     from "app/client/mall/js/detail-page/goods-detail/view/form-custom.js";
import AddAddressView     from "app/client/mall/js/detail-page/goods-detail/view/address-add.js";
import ConfirmAddressView from "app/client/mall/js/detail-page/goods-detail/view/address-confirm.js";
import AddressListView    from "app/client/mall/js/detail-page/goods-detail/view/address-list.js";
import {createRouter}     from "app/client/mall/js/common/router/router-factory.js";
import Navigator from "app/client/mall/js/menu/header/navigator.js";
const nav = new Navigator();
nav.render();
import BackTop from "com/mobile/widget/button/to-top.js";
new BackTop();

const viewDic = {
  "goods-detail"   : GoodsView,
  "goods-desc"     : DescView,
  "form-phone"     : OrderView,
  "form-custom"    : FormCustomView,
  "address-add"    : AddAddressView,
  "address-confirm": ConfirmAddressView,
  "address-list"   : AddressListView
};

export default createRouter({
  viewDic,
  defaultView: "goods-detail"
});
