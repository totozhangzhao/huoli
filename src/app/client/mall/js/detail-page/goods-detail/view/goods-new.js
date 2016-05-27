import $ from "jquery";
import _ from "lodash";
import async from "async";
import NativeAPI from "app/client/common/lib/native/native-api.js";
import {sendPost} from "app/client/mall/js/lib/mall-request.js";
import appInfo from "app/client/mall/js/lib/app-info.js";
import {toast} from "com/mobile/widget/hint/hint.js";
import hint from "com/mobile/widget/hint/hint.js";
import UrlUtil from "com/mobile/lib/url/url.js";
import * as widget from "app/client/mall/js/lib/common.js";
import mallUitl from "app/client/mall/js/lib/util.js";
import * as addressUtil from "app/client/mall/js/lib/address-util.js";
import loadScript from "com/mobile/lib/load-script/load-script.js";
import cookie from "com/mobile/lib/cookie/cookie.js";
import shareUtil from "com/mobile/widget/wechat/util.js";
import wechatUtil from "com/mobile/widget/wechat-hack/util.js";
import mallWechat from "app/client/mall/js/lib/wechat.js";
import {initTracker} from "app/client/mall/js/lib/common.js";
import Popover from "com/mobile/widget/popover/popover.js";
import pageAction from "app/client/mall/js/lib/page-action.js";
import ui from "app/client/mall/js/lib/ui.js";
import tplUtil from "app/client/mall/js/lib/mall-tpl.js";
import BaseView from "app/client/mall/js/common/views/BaseView.js";
import FooterView from "app/client/mall/js/common/views/footer.js";
import BuyPanelView from "app/client/mall/js/common/views/pay/buy-num-panel.js";
import BuyNumModel from "app/client/mall/js/common/models/buy-num-model.js";
import * as mallPromise from "app/client/mall/js/lib/mall-promise.js";

const detailLog = initTracker("detail");
const AppView = BaseView.extend({
  el: "#goods-detail",
  events: {
    "click .js-new-page"  : "createNewPage",
    "click .js-get-url"   : "handleGetUrl",
    "click .js-webview a" : "createNewPage",
    "click .js-privilege" : "showPrivilegePanel",
    "click .js-coupon"    : "showCouponPanel",
    "click .js-detail-bar": "showDetailInfo"
  },
  initialize(commonData) {
    _.extend(this, commonData);
    this.buyNumModel = new BuyNumModel();
    this.model.buyNumModel = this.buyNumModel;
    this.payView = new BuyPanelView({
      model: this.buyNumModel,
      buy: () => {this.buy();},
      pay: () => {this.pay();}
    });
    this.$initial = ui.initial();

    this.resetAppView = false;
    this.title = "";
    this.userDataOpitons = { reset: false };
    this.urlObj = UrlUtil.parseUrlSearch();
    this.action = this.urlObj.action;
    this.mallGoodsDetail();
  },
  resume() {
    this.$initial.show();

    if (this.title) {
      widget.updateViewTitle(this.title);
      this.$initial.hide();
      detailLog({
        title: this.title,
        productid: this.urlObj.productid,
        from: this.urlObj.from || "--"
      });
    }

    if (this.resetAppView) {
      pageAction.showRightButton({ text: "分享" });
    }

    hint.hideLoading();
  },
  mallGoodsDetail() {
    const self = this;

    async.waterfall([
      next => {
        appInfo.getUserData((err, userData) => {
          if (err) {
            toast(err.message, 1500);
            return;
          }

          next(null, userData);
        });
      },
      (userData, next) => {
        const params = _.extend({}, userData.userInfo, {
          imei: userData.deviceInfo.imei,
          p: userData.deviceInfo.p,
          productid: self.urlObj.productid
        });

        sendPost("goodsDetail", params, (err, data) => {
          next(err, data);
        });
      }
    ], (err, result) => {
      if (err) {
        toast(err.message, 1500);
        return;
      }

      self.render(result);
      self.$initial.hide();
    });
  },
  showPrivilegePanel() {
    this.$privilegePanel.show();
  },
  showCouponPanel() {
    this.$couponPanel.show();
  },
  showDetailInfo() {
    this.router.switchTo("goods-desc");
  },
  renderPrivilegePanle(data) {
    const self = this;
    const tmpl = require("app/client/mall/tpl/detail-page/goods-privilege.tpl");
    this.$privilegePanel = $(tmpl({ item: data })).hide().appendTo(this.$el);
    this.$privilegePanel.on("click", () => {
      self.$privilegePanel.hide();
    });
  },
  renderCouponPanel(data) {
    const self = this;
    const tmpl = require("app/client/mall/tpl/detail-page/goods-coupon.tpl");
    this.$couponPanel = $(tmpl({ couponList: data })).hide().appendTo(this.$el);
    this.$couponPanel.on("click", () => {
      self.$couponPanel.hide();
    });
  },
  renderGoodsInfo(goods) {

    // View: goods info
    const mainTmpl = require("app/client/mall/tpl/detail-page/goods-detail.tpl");

    goods.tplUtil = tplUtil;
    this.$el.html(mainTmpl(goods));

    // View: copyright
    new FooterView().render();

    if (this.privilege) {
      this.renderPrivilegePanle(this.privilege);
    }

    if (this.couponList) {
      this.renderCouponPanel(this.couponList);
    }
  },
  render(goods) {

    // router: use it as backbone view cache
    this.cache.goods = goods;

    this.title = goods.title;
    widget.updateViewTitle(goods.title);

    // 一元夺宝特权券
    if (_.isObject(goods.userprivilresp) && goods.userprivilresp.privilid) {
      this.privilid = goods.userprivilresp.privilid;
      this.privilprice = goods.userprivilresp.privilprice;
      this.privilege = goods.userprivilresp;
    } else {
      goods.userprivilresp = {};
    }

    // 商品优惠券
    if (Array.isArray(goods.couponrecords) && goods.couponrecords.length > 0) {
      this.couponList = goods.couponrecords;
    } else {
      goods.couponrecords = [];
    }

    this.renderGoodsInfo(goods);
    this.renderBuyNumView(goods);

    if (goods.wechatshare) {
      wechatUtil.setShareInfo(goods.wechatshare);
    }

    if ( this.urlObj.gotoView ) {
      if (this.urlObj.gotoView === "address-confirm") {
        if (goods.type === 3) {
          this.gotoAddress();
        }
      } else {
        this.router.switchTo( this.urlObj.gotoView );
      }
    } else {
      if ( wechatUtil.isWechatFunc() ) {
        wechatUtil.setTitle(goods.title);
        if ( shareUtil.hasShareInfo() ) {
          loadScript(`${window.location.origin}/fe/com/mobile/widget/wechat/wechat.bundle.js`);
        }
      } else if ( shareUtil.hasShareInfo() ) {
        mallWechat.initNativeShare();
        this.resetAppView = true;
      }

      const isApp = mallUitl.isAppFunc();

      if ( !isApp ) {
        require("app/client/mall/js/lib/download-app.js").init( isApp );
      }
    }

    detailLog({
      title: goods.title,
      productid: this.urlObj.productid,
      from: this.urlObj.from || "--"
    });
  },

  renderBuyNumView(goods) {
    this.buyNumModel.set({
      type: 0,
      hasMask: false,
      visible: true,
      title: "购买数量",
      payText: goods.button,
      payNumText: goods.button, //goods.money > 0 ? "去支付" : "立即兑换",
      points: goods.points,
      price: goods.money,
      limitNum: goods.limit,
      canPay: goods.stat === 0,
      parentDom: "#goods-detail"
    });
  },

  buy() {
    // 购买上限为1的情况
    if(this.buyNumModel.get("limitNum") === 1) {
      return this.pay();
    }
    return this.buyNumModel.set({
      type: 1,
      hasMask: true
    });
  },

  pay() {
    this.exchangeHandler();
  },

  exchangeHandler() {
    const self = this;
    const appName = cookie.get("appName");
    const goods = this.cache.goods;

    if ( /hbgj/i.test(appName) || /gtgj/i.test(appName) ) {
      if ( String(goods.stat) !== "0" ) {
        return;
      }

      async.waterfall([
        next => {
          appInfo.getUserData((err, userData) => {
            if (err) {
              toast(err.message, 1500);
              return;
            }

            next(null, userData);
          }, self.userDataOpitons);
        }
      ], (err, result) => {
        self.userDataOpitons.reset = false;

        if (result.userInfo.authcode) {

          // type：兑换类型
          // 1--直接调用创建订单接口
          // 2--转入输入手机号页面（预留，金融类）
          // 3--转入输入地址页面（预留）
          // 9--点击跳转第三方链接（ thirdparturl ）
          // 13--转入自定义表单页面
          switch (goods.type) {
            case 1:
              self.exchange();
              break;
            case 2:
              self.router.switchTo("form-phone");
              return;
            case 3:
              self.gotoAddress();
              return;
            case 9:
              self.gotoNewView({
                url: goods.thirdparturl
              });
              return;
            case 13:
              self.router.switchTo("form-custom");
              return;
          }
        } else {
          mallPromise.login();
        }
      });
    } else {
      if ( /hb/.test(window.location.hostname) ) {
        window.location.href = mallUitl.getHangbanAppUrl();
      } else {
        window.location.href = mallUitl.getGaotieAppUrl();
      }
    }
  },
  exchange() {
    if(this.buyNumModel.get("type") === 0) { // 不能选择数量的情况 需要弹出提示
      const titleText = this.cache.goods.confirm || "是否确认兑换？";

      // 确认兑换弹窗
      const confirm = new Popover({
        type: "confirm",
        title: titleText,
        message: "",
        agreeText: "确定",
        cancelText: "取消",
        agreeFunc: () => {
          this.mallCreateOrder();
        },
        cancelFunc() {}
      });
      confirm.show();
      return;
    }
    return this.mallCreateOrder();
  },

  gotoAddress() {
    const self = this;

    hint.showLoading();

    addressUtil.getList((err, result) => {
      if (err) {
        toast(err.message, 1500);
        return;
      }

      const AddressList = require("app/client/mall/js/detail-page/goods-detail/collection/address-list.js");
      const addressList = new AddressList();

      if (result.length > 0) {
        addressList.add(result);
      }

      self.collection.addressList = addressList;
      hint.hideLoading();

      if (result.length === 0) {
        self.router.switchTo("address-add");
      } else {
        self.router.switchTo("address-confirm");
      }
    });
  },
  mallCreateOrder() {
    const self = this;

    hint.showLoading();

    async.waterfall([
      next => {
        appInfo.getUserData((err, userData) => {
          if (err) {
            toast(err.message, 1500);
            return;
          }

          next(null, userData);
        });
      },
      (userData, next) => {
        const params = _.extend({}, userData.userInfo, {
          p: userData.deviceInfo.p,
          productid: self.urlObj.productid,
          num: self.buyNumModel.get("number")
        });

        if (self.privilid) {
          params.privilid = self.privilid;
          params.privilprice = self.privilprice;
        }

        sendPost("createOrder", params, (err, data) => {
          next(err, data);
        });
      }
    ], (err, result) => {
      if (err) {
        hint.hideLoading();
        const alertOptions = {
          type: "alert",
          title: "兑换失败",
          message: err.message,
          agreeText: "确定",
          agreeFunc() {
            // version 3.1 未实现 startPay 接口
            if (err.code === -99) {
              window.location.href = mallUitl.getUpgradeUrl();
            }
          }
        };
        if(self.errAlert){
          self.errAlert.model.set(alertOptions);
        }else{
          self.errAlert = new Popover(alertOptions);
        }
        self.errAlert.show();
        return;
      }

      self.handleCreateOrder(result);
    });
  },
  handleCreateOrder(orderInfo) {
    const self = this;

    async.waterfall([
      next => {
        if (String(orderInfo.paystatus) === "0" && orderInfo.payorderid) {
          let payUrl = `${window.location.origin}/bmall/payview.do?orderid=${orderInfo.orderid}`;

          if ( mallUitl.isHangbanFunc() ) {
            payUrl = `${window.location.origin}/bmall/hbpayview.do?orderid=${orderInfo.orderid}`;
          }

          // quitpaymsg  String 退出时候的提示
          // title       String 支付标题
          // price       String 商品价格
          // orderid     String 订单号
          // productdesc String 商品描述
          // url         String 显示订单基本信息的Wap页面
          // subdesc     String 商品详情描述
          const payParams = {
            quitpaymsg: "您尚未完成支付，如现在退出，可稍后进入“全部订单->订单详情”完成支付。确认退出吗？",
            title: "支付订单",
            price: orderInfo.payprice,
            orderid: orderInfo.payorderid,
            productdesc: orderInfo.paydesc,
            url: payUrl,
            subdesc: orderInfo.paysubdesc
          };

          NativeAPI.invoke("startPay", payParams, (err, payData) => {
            next(err, payData);
          });
        } else {
          next(null, null);
        }
      }
    ], (err, result) => {
      if (err) {
        toast(err.message, 1500);
        return;
      }

      const orderDetailUrl = `${window.location.origin}/fe/app/client/mall/html/detail-page/order-detail.html?orderid=${orderInfo.orderid}`;

      if (result) {
        self.gotoNewView({
          url: orderDetailUrl
        });
      } else {
        const alert = new Popover({
          type: "alert",
          title: "兑换成功",
          message: orderInfo.message,
          agreeText: "查看订单",
          agreeFunc() {
            self.gotoNewView({
              url: orderDetailUrl
            });
          }
        });
        alert.show();
      }

      hint.hideLoading();
    });
  },
  gotoNewView(options) {
    widget.createNewView(options);
  }
});

module.exports = AppView;
