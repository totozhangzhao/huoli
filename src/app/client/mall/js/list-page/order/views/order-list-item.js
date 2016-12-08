// import $ from "jquery";
import _ from "lodash";
import Backbone from "backbone";
import * as mallPromise from "app/client/mall/js/lib/mall-promise.js";
import * as mallUtil from "app/client/mall/js/lib/util.js";
import {sendPost} from "app/client/mall/js/lib/mall-request.js";
import {toast} from "com/mobile/widget/hint/hint.js";
import cookie from "com/mobile/lib/cookie/cookie.js";
import * as widget from "app/client/mall/js/lib/common.js";
import * as tplUtil from "app/client/mall/js/lib/mall-tpl.js";
import UrlUtil from "com/mobile/lib/url/url.js";
import hint from "com/mobile/widget/hint/hint.js";
import OrderData from "app/client/mall/js/list-page/order/utils/order-data.js";
// views
import Popover from "com/mobile/widget/popover/popover.js";

// templates
import orderListItemTpl from "app/client/mall/tpl/list-page/order/order-list-item.tpl";

const OrderListView = Backbone.View.extend({
  tagName: "li",

  className: "record-area js-touch-state touch-bg no-select",

  events: {
    "click .js-to-express": "toExpressInfo",
    "click .js-cancel-order": "cancelOrder",
    "click .js-delete-order": "deleteOrder",
    "click .js-purchase-order": "toPurchase",
    "click .js-to-goods-detail": "toGoodsDetail",
    "click .js-to-order-detail": "toOrderDetail",
    "click .js-to-customer-service": "toCustomerServiceView"
  },

  initialize(options = {}) {
    this.urlObj = UrlUtil.parseUrlSearch();
    this.isCustomerServiceView = options.isCustomerServiceView;
    this.listenTo(this.model, "destroy", this.remove);
    this.listenTo(this.model, "change", this.render);
  },

  render() {
    this.$el.hide();
    this.model.set({
      rendered: true
    });
    this.$el.html(orderListItemTpl({
      orderData:this.model.toJSON(),
      isCustomerServiceView: this.isCustomerServiceView,
      tplUtil
    }));
    if(this.model.get("show")) {
      this.$el.show();
    }
    return this;
  },

  // 取消订单
  cancelOrder() {
    // 取消成功 operateType重置为0
    //         action 重置为2 再次购买
    if( !this.cancleConfirm ) {
      this.cancleConfirm = new Popover({
        type: "confirm",
        title: "确定要取消订单吗？",
        message: "",
        agreeText: "确定",
        cancelText: "取消",
        agreeFunc: () => {
          this.cancelDeleteOrderHanlder(1);
        },
        cancelFunc() {}
      });
    }
    this.cancleConfirm.show();
  },

  // 删除订单
  deleteOrder() {
    if( !this.deleteConfirm ) {
      this.deleteConfirm = new Popover({
        type: "confirm",
        title: "确定要删除订单吗？",
        message: "",
        agreeText: "确定",
        cancelText: "取消",
        agreeFunc: () => {
          this.cancelDeleteOrderHanlder(2);
        },
        cancelFunc() {}
      });
    }
    this.deleteConfirm.show();
  },

  // type  1 取消订单  2 删除订单
  cancelDeleteOrderHanlder(type) {
    hint.showLoading();
    let message = "订单已取消";
    let method = "cancelOrder";
    if(type === 2) {
      method = "removeOrder";
      message = "订单已删除";
    }
    mallPromise
      .getAppInfo()
      .then(userData => {
        const params = _.extend({}, userData.userInfo, {
          p: userData.deviceInfo.p,
          orderid: this.model.get("orderid")
        });
        return new Promise( (resolve, reject) => {
          sendPost(method, params, (err, result) => {
            hint.hideLoading();
            if(err) {
              reject(err);
            }else {
              resolve(result);
            }
          });
        });
      })
      .then( result => {
        if(result === "ok") {
          this.syncOrderStatus(type, this.model.get("orderid"));
          setTimeout(() => {
            widget.imageDelay();
          },300);
          toast(message, 1500);
        }
      }).catch( err => {
        toast(err.message, 3000);
      });
  },

  syncOrderStatus(type, orderid) {
    _.each(OrderData, (item) => {
      item.orders.where({orderid: orderid})
      .forEach((orderItem) => {
        orderItem.updateStatus(type);
      });
    });

  },

  // 去支付
  toPurchase() {
    const orderInfo = {};
    orderInfo.token = cookie.get("token");
    orderInfo.returnUrl = window.location.href;
    orderInfo.payorderid = this.model.get("payorderid");
    orderInfo.payprice = this.model.get("payprice");
    orderInfo.orderid = this.model.get("orderid");
    orderInfo.paydesc = this.model.get("shotdesc");
    orderInfo.paysubdesc = '';

    mallPromise.initPay(orderInfo)
    .then(() => {
      window.location.reload();
    });
  },

  // 查看物流
  toExpressInfo() {
    const url = `/fe/app/client/mall/html/detail-page/express/list.html?orderId=${this.model.get("orderid")}`;
    widget.createNewView({ url });
  },

  // 再次购买
  toGoodsDetail() {
    let url = `${tplUtil.getBlockUrl({action: 0})}?productid=${this.model.get('productid')}`;
    widget.createNewView({ url });
  },

  toOrderDetail() {
    let url = `/fe/app/client/mall/html/detail-page/order-detail.html?orderid=${this.model.get("orderid")}&from=order-list-page`;
    if( !mallUtil.isAppFunc() ) {
      widget.redirectPage(url);
    } else {
      widget.createNewView({
        url: url,
        title: "订单详情"
      });
    }
  },

  toCustomerServiceView() {
    const url = this.urlObj.detailurl + this.model.get("orderid");
    widget.createNewView({
      url: url,
      title: "订单详情"
    });
  }
});

export default OrderListView;
