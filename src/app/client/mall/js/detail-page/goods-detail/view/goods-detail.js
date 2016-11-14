import $ from "jquery";
import _ from "lodash";
import {sendPost} from "app/client/mall/js/lib/mall-request.js";
import hint from "com/mobile/widget/hint/hint.js";
import UrlUtil from "com/mobile/lib/url/url.js";
import {toast} from "com/mobile/widget/hint/hint.js";
import * as mallUtil from "app/client/mall/js/lib/util.js";
import * as addressUtil from "app/client/mall/js/lib/address-util.js";
import cookie from "com/mobile/lib/cookie/cookie.js";
import shareUtil from "com/mobile/widget/wechat/util.js";
import * as mallWechat from "app/client/mall/js/lib/wechat.js";
import Popover from "com/mobile/widget/popover/popover.js";
import pageAction from "app/client/mall/js/lib/page-action.js";
import ui from "app/client/mall/js/lib/ui.js";
import * as tplUtil from "app/client/mall/js/lib/mall-tpl.js";
import BaseView from "app/client/mall/js/common/views/BaseView.js";
import FooterView from "app/client/mall/js/common/views/footer.js";
import BuyPanelView from "app/client/mall/js/common/views/pay/buy-num-panel.js";
import BuyNumModel from "app/client/mall/js/common/models/buy-num-model.js";
import AddressList from "app/client/mall/js/detail-page/goods-detail/collection/address-list.js";
import Util from "com/mobile/lib/util/util.js";
import Tab from "com/mobile/widget/button/tab.js";
import Swipe from "com/mobile/lib/swipe/swipe.js";
import * as mallPromise from "app/client/mall/js/lib/mall-promise.js";
import * as widget from "app/client/mall/js/lib/common.js";
import buyTemplate from "app/client/mall/tpl/detail-page/goods/goods-buy-panel.tpl";

const detailLog = widget.initTracker("detail");

const AppView = BaseView.extend({
  el: "#goods-detail",
  events: {
    "click .js-new-page"  : "createNewPage",
    "click .js-get-url"   : "handleGetUrl",
    "click .js-webview a" : "createNewPage",
    "click .js-privilege" : "showPrivilegePanel",
    "click .js-coupon"    : "showCouponPanel",
    "click .js-collect"   : "collectHandler"
  },
  initialize(commonData) {
    _.extend(this, commonData);
    this.$initial = ui.initial();
    this.urlObj = UrlUtil.parseUrlSearch();
    this.cache.urlObj = this.urlObj;
    this.resetAppView = false;
    this.title = "";
    this.action = this.urlObj.action;
    this.isAndroid = Util.getMobileSystem() === "Android";
    this.mallGoodsDetail();
  },
  resume() {
    mallUtil.allowScroll();
    this.$initial.show();

    if (this.title) {
      widget.updateViewTitle(this.title);
      this.$initial.hide();
      detailLog({
        title: this.title,
        productid: this.urlObj.productid,
        hlfrom: this.urlObj.hlfrom || "--"
      });
    }

    if (this.resetAppView) {
      pageAction.showRightButton({ text: "分享" });
    }

    hint.hideLoading();
  },
  mallGoodsDetail() {
    mallPromise
      .getAppInfo(true)
      .then(userData => {
        const params = _.extend({}, userData.userInfo, {
          imei: userData.deviceInfo.imei,
          p: userData.deviceInfo.p,
          productid: this.urlObj.productid
        });

        return new Promise((resovle, reject) => {
          sendPost("goodsDetail", params, (err, data) => {
            if (err) {
              reject(err);
            } else {
              resovle(data);
            }
          });
        });
      })
      .then(goods => {
        const specList = goods.specs;

        if ( Array.isArray(specList) && specList.length > 0 ) {
          let index = _.findIndex(specList, item => {
            return item.limit > 0;
          });
          if (index === -1) {
            goods.payError = {
              message: "无可选规格"
            };
          }
          index = index !== -1 ? index : 0;
          const spec = goods.specs[index];
          _.extend(goods, {
            specIndex: index,
            limit: spec.limit,
            // paytype: spec.paytype,
            points: spec.points,
            money: spec.price,
            smallimg: spec.img
          });
        } else {
          goods.specs = [];
          if (goods.limit === 0) {
            goods.payError = {
              message: "商品数量不足"
            };
          }
        }
        this.render(goods);
        this.$initial.hide();
      })
      .catch((err) => {
        if(err.code === -202) {
          window.location.replace("/fe/app/client/mall/404.html");
        } else {
          mallPromise.catchShowError(err);
        }
      });
  },
  showPrivilegePanel() {
    this.$privilegePanel.show();
  },
  showCouponPanel() {
    this.$couponPanel.show();
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
  loadSwipe() {
    const $SwipeBox = $(".js-banner-box", this.$el);
    const $index    = $(".js-banner-index>i", this.$el);
    new Swipe($SwipeBox.get(0), {
      startSlide: 0,
      speed: 600,
      auto: 3000,
      continuous: true,
      disableScroll: false,
      stopPropagation: false,
      callback(index) {
        index = Swipe.fixIndex(index, $index.length);
        $index
          .removeClass("active")
            .eq(index)
            .addClass("active");
      },
      transitionEnd() {}
    });
  },
  renderGoodsInfo(goods) {

    // View: goods info
    const mainTmpl = require("app/client/mall/tpl/detail-page/goods-detail.tpl");

    goods.tplUtil = tplUtil;
    this.$el.html(mainTmpl(goods));

    // Tab widget
    new Tab( this.$el.find(".js-tab-wrapper"), this.$el.find(".js-tab-content") );

    // Swipe/Banner widget
    this.loadSwipe();
    widget.imageDelay();
    this.$detail = this.$el.find(".js-detail-bar");

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

    this.initModel(goods);
    goods.unitPriceText = this.buyNumModel.getPPriceText(1);
    if (goods.relevance) {
      goods.relevance.unitPriceText = this.relevanceModel.getPPriceText(1);
    }

    this.renderGoodsInfo(goods);
    this.renderBuyNumView(goods);
    this.updateCollect();
    if ( this.urlObj.gotoView ) {
      if (this.urlObj.gotoView === "address-confirm") {
        if (goods.type === 3) {
          this.gotoAddress();
        }
      } else {
        this.router.switchTo( this.urlObj.gotoView );
      }
    } else {
      mallWechat.initShare({
        wechatshare: goods.wechatshare,
        title: goods.title,
        useAppShare: true
      });

      if ( shareUtil.hasShareHtml() ) {
        this.resetAppView = true;
      }

      const isApp = mallUtil.isAppFunc();

      if ( !isApp ) {
        require("app/client/mall/js/lib/download-app.js").init( isApp );
      }
    }

    detailLog({
      title: goods.title,
      productid: this.urlObj.productid,
      hlfrom: this.urlObj.hlfrom || "--"
    });
  },
  initModel(goods) {
    let discount = (_.isObject(goods.userprivilresp) && goods.userprivilresp.privilid) ? 1 : 0;
    // init buy panel model
    this.buyNumModel = new BuyNumModel({
      type: 0,
      discount: discount,
      payType: goods.paytype,
      hasMask: false,
      visible: true,
      title: goods.title,
      giftType: goods.gifttype,
      payText: goods.button,
      payNumText: goods.button, //goods.money > 0 ? "去支付" : "立即兑换",
      points: goods.points,
      price: goods.money,
      avatar: goods.smallimg,
      limitNum: goods.limit,
      canPay: goods.stat === 0,
      showCollect: true,      // 显示收藏按钮
      parentDom: "#goods-detail"
    });
    if (goods.specs.length > 0) {
      const spec = goods.specs[goods.specIndex];
      this.buyNumModel.set({
        specIndex: goods.specIndex,
        specName: goods.specname,
        specList: goods.specs,
        specValueName: spec.spec,
        specValueId: spec.goodspecid
      });
    }

    if (goods.relevance) {
      this.relevanceModel = new BuyNumModel({
        type: 0,
        payType: goods.relevance.paytype,
        hasMask: false,
        visible: false,
        points: goods.relevance.points,
        price: goods.relevance.money
      });
    }
  },
  renderBuyNumView() {
    this.payView = new BuyPanelView({
      template: buyTemplate,
      model: this.buyNumModel,
      buy: () => {this.buy();},
      pay: () => {this.pay();}
    });

    this.model.buyNumModel = this.buyNumModel;
    this.cache.payView = this.payView;

    this.buyNumModel.set({
      _t: Date.now()
    });
  },

  // 弹出数量选择界面
  buy() {
    let self = this;
    const goods = this.cache.goods;

    if ( goods.stat !== 0 ) {
      return;
    }

    function _buy() {

      // 购买上限为1的情况
      if( self.buyNumModel.get("limitNum") === 1 && self.buyNumModel.get("specList").length === 0 ) {
        return self.pay();
      }
      return self.buyNumModel.set({
        type: 1,
        hasMask: true
      });
    }

    function _do() {
      mallPromise
        .checkLogin()
        .then(() => {
          _buy();
        })
        .catch(mallPromise.catchFn);
    }

    if ( mallUtil.isAppFunc() || mallUtil.isTest ) {
      _do();
    } else {
      new Promise((resovle, reject) => {
        let params = {
          token: cookie.get("token")
        };
        sendPost("checkWhiteList", params, (err, data) => {
          if (err) {
            reject(err);
          } else {
            resovle(data);
          }
        });
      })
        .then(() => {
          _do();
        })
        .catch(mallPromise.catchShowError);
    }
  },

  // 选数量后，去支付流程
  pay() {
    const goods = this.cache.goods;

    if (goods.payError) {
      mallPromise.catchShowError(goods.payError);
      return;
    }
    // 调用支付分发器
    this.payDespatcher(goods);
  },

  // 支付处理分发
  payDespatcher(goods) {
    // type：兑换类型
    // 1--直接调用创建订单接口
    // 2--转入输入手机号页面（预留，金融类）
    // 3--转入输入地址页面（预留）
    // 9--点击跳转第三方链接（ thirdparturl ）
    // 13--转入自定义表单页面
    switch (goods.type) {
      case 1:
        if(this.buyNumModel.get("isGift")) {
          this.router.switchTo("address-confirm");
        }else {
          this.exchange();
        }
        return;
      case 2:
        this.router.switchTo("form-phone");
        return;
      case 3:
        this.gotoAddress();
        return;
      case 9:
        this.gotoNewView({
          url: goods.thirdparturl
        });
        return;
      case 13:
        this.router.switchTo("form-custom");
        return;
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
        cancelFunc() {
          mallUtil.allowScroll();
        }
      });
      confirm.show();
      return;
    }
    return this.mallCreateOrder();
  },

  gotoAddress() {
    const self = this;

    hint.showLoading();

    addressUtil.getList(result => {
      const addressList = new AddressList();

      if (result.length > 0) {
        addressList.add(result);
      }

      self.collection.addressList = addressList;
      hint.hideLoading();

      // 是微信送礼的情况 或者有地址的情况 进入确认页面，否则进入添加地址页面
      if(this.buyNumModel.get("isGift") || result.length > 0) {
        self.router.switchTo("address-confirm");
      } else {
        self.router.switchTo("address-add");
      }
    });
  },
  mallCreateOrder() {
    let params = {
      goodspecid: this.buyNumModel.get("specValueId"),
      num: this.buyNumModel.get("number"),
      productid: this.urlObj.productid
    };

    if (this.privilid) {
      params.privilid = this.privilid;
      params.privilprice = this.privilprice;
    }

    hint.showLoading();

    mallPromise
      .order(params)
      .then(orderInfo => {
        if (orderInfo === void 0) {
          return;
        }
        return this.afterCreateOrder(orderInfo);
      })
      .catch(err => {
        hint.hideLoading();
        if (err.code === -3330 || err.code === -3331) {
          mallPromise.catchFn(err);
        } else {
          const alertOptions = {
            type: "alert",
            title: "兑换失败",
            message: err.message,
            agreeText: "确定",
            agreeFunc() {
              // version 3.1 未实现 startPay 接口
              if (err.code === -99) {
                window.location.href = mallUtil.getUpgradeUrl();
              }
            }
          };
          if (this.errAlert) {
            this.errAlert.model.set(alertOptions);
          } else {
            this.errAlert = new Popover(alertOptions);
          }
          this.errAlert.show();
        }
      });
  },
  afterCreateOrder(orderInfo) {
    let self = this;
    let orderDetailUrl = window.location.origin +
      `/fe/app/client/mall/html/detail-page/order-detail.html?orderid=${orderInfo.orderid}`;

    function success(payResult) {
      if (payResult) {
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
    }

    if (String(orderInfo.paystatus) === "0" && orderInfo.payorderid) {
      orderInfo.returnUrl = orderDetailUrl;
      return mallPromise
        .initPay(orderInfo)
        .then(success);
    } else {
      return success();
    }
  },
  gotoNewView(options) {
    widget.createNewView(options);
  },

  /**
   * @param {event} e 点击事件
   * @return {void}
   */
  collectHandler() {
    let method = "collectGoods";
    if(this.cache.goods.collect.isCollect === 2) {
      method = "cancelCollect";
    }
    mallPromise
      .getAppInfo(true)
      .then(userData => {
        const params = _.extend({}, userData.userInfo, {
          productid: this.cache.goods.productid
        });
        return new Promise((resovle, reject) => {
          sendPost(method, params, (err, data) => {
            if (err) {
              reject(err);
            } else {
              resovle(data);
            }
          });
        });
      })
      .then((result) => {
        this.cache.goods.collect = result;
        this.updateCollect(true);
      })
      .catch(mallPromise.catchFn);
  },


  /**
   * @param {int} goods.collect.isCollect - 更新收藏状态  isCollect 1:未收藏 2:已收藏
   * @param {boolean} showMessage - true 显示提示消息  false 不显示提示消息
   * @description 更新页面中的收藏按钮状态
   * @return {void}
   */
  updateCollect(showMessage = false) {
    let message = "取消收藏成功";
    if(this.cache.goods.collect.isCollect === 2) {
      message = "收藏成功";
      $(".collect-button.js-collect:not(.yes)").addClass("yes");
    } else {
      $(".collect-button.js-collect.yes").removeClass("yes");
    }
    if(showMessage) {
      toast(message, 1500);
    }
  }
});

export default AppView;
