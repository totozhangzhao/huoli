import ProfileIndexView from "app/client/mall/js/profile/view/profile-index.js";
import CouponListView from "app/client/mall/js/profile/view/coupon-list.js";
import CouponDetailView from "app/client/mall/js/profile/view/coupon-detail.js";
import {createRouter} from "app/client/mall/js/common/router/router-factory.js";
import BackTop from "com/mobile/widget/button/to-top.js";

new BackTop();

const viewDic = {
  "profile-index": ProfileIndexView,
  "coupon-list"  : CouponListView,
  "coupon-detail": CouponDetailView
};

export default createRouter({
  viewDic,
  defaultView: "profile-index"
});
