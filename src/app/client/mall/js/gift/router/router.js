import Index from "app/client/mall/js/gift/view/index.js";
import Receive from "app/client/mall/js/gift/view/receive.js";
import Info from "app/client/mall/js/gift/view/info.js";
import AddAddressView     from "app/client/mall/js/detail-page/goods-detail/view/address-add.js";
import ConfirmAddressView from "app/client/mall/js/detail-page/goods-detail/view/address-confirm.js";
import AddressListView    from "app/client/mall/js/detail-page/goods-detail/view/address-list.js";
import {createRouter}     from "app/client/mall/js/common/router/router-factory.js";
import BackTop from "com/mobile/widget/button/to-top.js";
new BackTop();

const viewDic = {
  "index"          : Index,
  "receive"        : Receive,
  "info"           : Info,
  "address-add"    : AddAddressView,
  "address-confirm": ConfirmAddressView,
  "address-list"   : AddressListView
};

export default createRouter({
  viewDic,
  defaultView: "index"
});
