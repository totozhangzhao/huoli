import $ from "jquery";
import Backbone from "backbone";
import * as mallUtil from "app/client/mall/js/lib/util.js";
import {toast} from "com/mobile/widget/hint/hint.js";
import template from "app/client/mall/tpl/detail-page/goods-detail/payment/payment.tpl";

const PaymentView = Backbone.View.extend({

  tagName: "div",

  events: {
    "touchstart [data-operator]" : "beginTouch",
    "touchend [data-operator]"   : "endTouch",
    "keyup .js-goods-num-input"  : "inputKeyUp",
    "keydown .js-goods-num-input": "inputKeyDown",
    "blur .js-goods-num-input"   : "inputBlur",
    "click .js-spec"             : "changeSpec",
    "click .js-close-panel"      : "close",
    "click .common-shadow"       : "close",
    "click .js-goods-normal-pay" : "purchase",
    "click .js-goods-gift-pay"   : "gift",
    "click .goods-confirm-btn"   : "purchaseHanlder"
  },

  initialize(options) {
    this.template = template;
    this.exchange = options.exchange || (() => {});
    this.buy = options.buy || (() => {});
    this.pay = options.pay || (() => {});
    this.listenTo(this.model, "change", this.render);
    this.listenTo(this.model, "destroy", this.remove);
    this.comboId = null;
  },

  // 渲染视图
  render() {
    if(this.model.get("specIndex") >= 0) {
      let specData = this.model.get("specList")[this.model.get("specIndex")];
      if(specData) {
        this.model.set({
          payType: specData.paytype,
          points: specData.points,
          price: specData.price,
          specValueName: specData.spec,
          specValueId: specData.goodspecid,
          avatar: specData.img
        }, { silent: true });
      }
    }

    let tplData = this.model.toJSON();
    tplData.unitPriceText = this.model.getPPriceText(1);
    tplData.totalPriceText = this.model.getPPriceText();
    this.$el.html(this.template(tplData));
    this.$el.appendTo(this.model.get("parentDom"));

    this.$avatarList = this.$el.find(".js-avatar-img");
    this.$unitPriceView = $(".js-unit-price");
    this.$totalPriceView = $(".js-total-price");
    this.$totalPriceWithOutDiscountView = $(".js-total-without-discount");
    this.$chargeBtn = this.$el.find(".js-goods-pay");
    this.$numberInput = this.$el.find(".js-goods-num-input");
    this.$add = this.$el.find("[data-operator='add']");
    this.$sub = this.$el.find("[data-operator='subtract']");

    this.updateMoneyView();
    this.$chargeBtn
      .text(this.model.getPayBtnText())
      .data("payBtnType", this.model.getPayBtnText());
    return this;
  },

  updateMoneyView() {
    if (this.$unitPriceView.length > 0) {
      this.$unitPriceView.text(this.model.getPPriceText(1));
    }

    if (this.$totalPriceView.length > 0) {
      this.$totalPriceView.text(this.model.getPPriceText(false, true));
      this.$totalPriceWithOutDiscountView.text(this.model.getPPriceText());
    }
  },

  refresh() {
    const model = this.model.toJSON();

    this.$numberInput.val(model.number);
    this.updateMoneyView();

    if (model.number === 1) {
      this.$sub.addClass("off");
    } else {
      this.$sub.removeClass("off");
    }

    if (model.number < model.limitNum) {
      this.$add.removeClass("off");
    } else {
      this.$add.addClass("off");
    }

    if(this.model.has("refresh")) {
      try{
        this.model.get("refresh")();
      }catch(e) {
        window.console.log(e);
      }
    }
  },

  fixNum(number = 1) {
    number = Number(number);
    const limitNum = this.model.get("limitNum");
    const minNum = this.model.get("minNum");
    if(number > limitNum){
      number = limitNum;
      toast("已到单笔订单数量上限", 1500);
    }else if(number < minNum){
      number = minNum;
    }
    return number;
  },

  validateNum(number) {
    return number === this.fixNum(number);
  },

  setNumber(number) {
    number = this.fixNum(number);
    this.model.set({number},{silent: true});
    this.refresh();
  },

  combo(delay) {
    if( this.comboMode ) {
      let number = this.model.get("number");
      if(this.computeMode === "add"){
        number++;
      }else{
        number--;
      }
      if(this.validateNum(number)){
        this.setNumber(number);
        this.comboId = setTimeout(() => {
          this.combo(100);
        },delay);
      }
    }
  },

  beginTouch(e) {
    const $cur = $(e.currentTarget);
    if ($cur.hasClass("off")) {
      return;
    }
    // 开始连续增减模式
    this.computeMode = $cur.data("operator");
    this.comboMode = true;
    window.clearTimeout(this.comboId);
    this.combo(500);
  },

  endTouch() {
    // 结束连续增减模式
    this.comboMode = false;
  },

  inputKeyUp(e) {
    // const val = this.$numberInput.val();
    const val = $(e.currentTarget).val();
    if ( !val || isNaN(val)) {
      return ;
    }
    if (val !== "") {
      return this.setNumber(val);
    }
  },

  inputKeyDown(e) {
    if ( e.which !== 8 && (e.which < 48 || e.which > 57 ) ) {
      e.preventDefault();
      return;
    }
  },

  inputBlur(e) {
    // const val = this.$numberInput.val();
    const val = $(e.currentTarget).val();
    if ( !val || isNaN(val) ) {
      return this.setNumber(1);
    }
    return this.setNumber(val);
  },

  changeSpec(e) {
    const $cur = $(e.currentTarget);

    if ( $cur.hasClass("off") ) {
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
      avatar: spec.img
    }, { silent: true });

    if (spec.limit) {
      this.model.set({
        limitNum: spec.limit
      }, { silent: true });
      let num = this.model.get("number");
      num =  (num <= spec.limit) ? num : spec.limit;
      this.setNumber(num);
    } else {
      this.refresh();
    }
  },

  purchase() {
    this.model.set({isGift: false}, {silent: true});
    this.purchaseHanlder();
  },

  gift() {
    this.model.set({isGift: true}, {silent: true});
    this.purchaseHanlder();
  },

  purchaseHanlder() {
    switch(this.model.get("type")) {
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
    if(this.model.get("closeAll")) {
      this.model.destroy();
    }else{
      this.model.set({
        type: 0,
        hasMask: false
      });
    }
  },

  /**
   * @param {boolean} flag - 是否收藏 true 已收藏 false 未收藏
   *
   * @return {void} 无返回
   */
  isCollected(flag) {
    if(flag) {
      $(".js-collect:not(.yes)", this.$el).addClass("yes");
    } else {
      $(".js-collect.yes", this.$el).removeClass("yes");
    }
  }
});
module.exports = PaymentView;
