var ProfileIndexView = require("app/client/mall/js/profile/view/profile-index.js");
var CouponListView   = require("app/client/mall/js/profile/view/coupon-list.js");
var CouponDetailView = require("app/client/mall/js/profile/view/coupon-detail.js");
var createRouter     = require("app/client/mall/js/common/router/router-factory.js").createRouter;
import BackTop from "com/mobile/widget/button/to-top.js";
new BackTop();
var viewDic = {
  "profile-index": ProfileIndexView,
  "coupon-list"  : CouponListView,
  "coupon-detail": CouponDetailView
};

module.exports = createRouter({
  viewDic: viewDic,
  defaultView: "profile-index"
});
