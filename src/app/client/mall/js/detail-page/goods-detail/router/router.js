var GoodsView          = require("app/client/mall/js/detail-page/goods-detail/view/goods-detail.js");
var DescView           = require("app/client/mall/js/detail-page/goods-detail/view/goods-desc.js");
var OrderView          = require("app/client/mall/js/detail-page/goods-detail/view/form-phone.js");
var FormCustomView     = require("app/client/mall/js/detail-page/goods-detail/view/form-custom.js");
var AddAddressView     = require("app/client/mall/js/detail-page/goods-detail/view/address-add.js");
var ConfirmAddressView = require("app/client/mall/js/detail-page/goods-detail/view/address-confirm.js");
var AddressListView    = require("app/client/mall/js/detail-page/goods-detail/view/address-list.js");
var createRouter       = require("app/client/mall/js/common/router/router-factory.js").createRouter;
import BackTop from "com/mobile/widget/button/to-top.js";
new BackTop();
var viewDic = {
  "goods-detail"   : GoodsView,
  "goods-desc"     : DescView,
  "form-phone"     : OrderView,
  "form-custom"    : FormCustomView,
  "address-add"    : AddAddressView,
  "address-confirm": ConfirmAddressView,
  "address-list"   : AddressListView
};

module.exports = createRouter({
  viewDic: viewDic,
  defaultView: "goods-detail"
});
