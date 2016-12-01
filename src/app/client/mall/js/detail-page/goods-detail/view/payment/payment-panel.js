import $ from "jquery";
import Backbone from "backbone";
import * as mallUtil from "app/client/mall/js/lib/util.js";
import {toast} from "com/mobile/widget/hint/hint.js";
import template from "app/client/mall/tpl/detail-page/goods-detail/payment/payment.tpl";
import BaseNumView from "app/client/mall/js/common/views/num-operator/base.js";
import BaseMoneyView from "app/client/mall/js/common/views/money/base.js";

const PaymentView = Backbone.View.extend({

  tagName: "div",

  events: {
    "click .js-spec": "changeSpec",
    "click .common-shadow": "close",
    "click .js-close-panel": "close",
    "click .js-goods-normal-pay": "purchase",
    "click .js-goods-gift-pay": "gift",
    "click .goods-confirm-btn": "purchaseHanlder"
  },

  initialize(options) {
    this.template = template;
    this.exchange = options.exchange || (() => {});
    this.buy = options.buy || (() => {});
    this.pay = options.pay || (() => {});

    this.listenTo(this.model, "change", this.render);
    this.listenTo(this.model, "destroy", this.remove);

    this.moneyView = new BaseMoneyView({
      el: this.el,
      model: this.model
    });
    this.numView = new BaseNumView({
      el: this.el,
      model: this.model
    });
  },

  // 渲染视图
  render(model) {
    function notHas(obj, keys) {
      return 0 === keys.reduce((prev, key) => {
        return prev + obj.hasOwnProperty(key) ? 1 : 0;
      }, 0);
    }

    const shouldRender = [
      "visible",
      "type",
      "hasMask",
      "_t"
    ];

    if (notHas(model.changed, shouldRender)) {
      this.refresh(model);
    } else {
      this.renderPanel();
    }
  },

  renderPanel() {
    // window.console.log("renderPanel");
    let tplData = this.model.toJSON();
    tplData.unitPriceText = this.model.getPPriceText(1);
    tplData.totalPriceText = this.model.getPPriceText();
    this.$el.html(this.template(tplData));
    this.$el.appendTo(this.model.get("parentDom"));

    this.$el.find(".js-goods-pay")
      .text(this.model.getPayBtnText())
      .data("payBtnType", this.model.getPayBtnText());

    this.setRefresh();
    this.moneyView.refresh();

    return this;
  },

  setRefresh() {
    this.$avatarList = this.$el.find(".js-avatar-img");
    this.$collect = this.$el.find(".js-collect");
    this.moneyView.setRefresh();
    this.numView.setRefresh();
  },

  refresh(model) {
    // window.console.log("refresh");
    if (model.get("isCollect") === 2) {
      this.$collect.addClass("yes");
    } else {
      this.$collect.removeClass("yes");
    }
    this.moneyView.refresh();
    this.numView.refresh();
  },

  changeSpec(e) {
    const $cur = $(e.currentTarget);

    if ($cur.hasClass("off")) {
      return;
    }

    this.specList = this.specList || this.model.get("specList");
    const index = $cur.data("index");
    const spec = this.specList[index];

    if (spec.limit <= 0) {
      toast("规格库存量小于等于零", 1500);
      return;
    }

    this.$el
      .find(".js-spec")
      .removeClass("on");
    $cur.addClass("on");

    this.$avatarList
      .hide()
      .eq(index)
      .show();

    // goodspecid int 商品规格id
    // spec String 商品规格值
    // price float 商品价格
    // points int 商品积分
    // oriprice float 商品原价
    // paytype int 支付类型
    // img float 规格图片
    // left int 可买数量
    // limit int 限购数量
    this.model.set({
      specIndex: index,
      payType: spec.paytype,
      points: spec.points,
      price: spec.price,
      specValueName: spec.spec,
      specValueId: spec.goodspecid,
      avatar: spec.img,
      limitNum: spec.limit,
      limitMessage: spec.limitmsg
    }, {
      silent: true
    });

    let num = this.model.get("number");
    num = (num <= spec.limit) ? num : spec.limit;
    this.numView.setNumber(num);
  },

  purchase() {
    this.model.set({
      isGift: false
    }, {
      silent: true
    });
    this.purchaseHanlder();
  },

  gift() {
    this.model.set({
      isGift: true
    }, {
      silent: true
    });
    this.purchaseHanlder();
  },

  purchaseHanlder() {
    switch (this.model.get("type")) {
      case 0:
        mallUtil.forbiddenScroll();
        this.buy();
        break;
      case 1:
        this.pay();
        break;
    }
  },

  close() {
    mallUtil.allowScroll();
    if (this.model.get("closeAll")) {
      this.model.destroy();
    } else {
      this.model.set({
        type: 0,
        hasMask: false
      });
    }
  }
});

module.exports = PaymentView;
