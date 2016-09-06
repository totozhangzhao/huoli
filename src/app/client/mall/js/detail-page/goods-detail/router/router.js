import GoodsView          from "app/client/mall/js/detail-page/goods-detail/view/goods-detail.js";
import OrderView          from "app/client/mall/js/detail-page/goods-detail/view/form-phone.js";
import FormCustomView     from "app/client/mall/js/detail-page/goods-detail/view/form-custom.js";
import AddAddressView     from "app/client/mall/js/detail-page/goods-detail/view/address-add.js";
import ConfirmAddressView from "app/client/mall/js/detail-page/goods-detail/view/address-confirm.js";
import AddressListView    from "app/client/mall/js/detail-page/goods-detail/view/address-list.js";
import GetUrlView         from "app/client/mall/js/detail-page/goods-detail/view/get-url.js";
import GiftConfirm        from "app/client/mall/js/detail-page/goods-detail/view/gift-confirm.js";
import {createRouter}     from "app/client/mall/js/common/router/router-factory.js";
import BackTop from "com/mobile/widget/button/to-top.js";
new BackTop();

const viewDic = {
  "goods-detail"   : GoodsView,
  "form-phone"     : OrderView,
  "form-custom"    : FormCustomView,
  "address-add"    : AddAddressView,
  "address-confirm": ConfirmAddressView,
  "address-list"   : AddressListView,
  "gift-confirm"   : GiftConfirm,
  "get-url"        : GetUrlView
};

export default createRouter({
  viewDic,
  defaultView: "goods-detail"
});
