import $ from "jquery";
import Backbone from "backbone";
import {toast} from "com/mobile/widget/hint/hint.js";

const BuyNumPanelView = Backbone.View.extend({

  tagName: "div",

  events: {
    "touchstart [data-operator]" : "beginTouch",
    "touchend [data-operator]"   : "endTouch",
    "keyup .number-input"        : "inputKeyUp",
    "keydown .number-input"      : "inputKeyDown",
    "blur .number-input"         : "inputBlur",
    "click .common-buy-close-btn": "close",
    "click .common-shadow"       : "close",
    "click .charge-btn"          : "purchase"
  },

  template: require("app/client/mall/tpl/common/buy-num-panel.tpl"),

  priceTemplate: require("app/client/mall/tpl/common/price-text.tpl"),

  initialize(options) {
    this.exchange = options.exchange || (() => {});
    this.buy = options.buy || (() => {});
    this.pay = options.pay || (() => {});
    this.listenTo(this.model, "change", this.render);
    this.listenTo(this.model, "destroy", this.remove);
    this.comboId = null;
  },

  // 渲染视图
  render() {
    this.$el.appendTo(this.model.get("parentDom"));
    this.$el.html(this.template(this.model.toJSON()));

    this.$priceView = this.$el.find(".goods-charge-bar .goods-charge-info");
    this.$chargeBtn = this.$el.find(".charge-btn");
    this.$numberInput = this.$el.find(".number-input");

    this.$priceView.html(this.priceTemplate(this.model.toJSON()));
    this.$chargeBtn
      .text(this.model.getPayBtnText())
      .data("payBtnType", this.model.getPayBtnText());
    return this;
  },

  refresh() {
    this.$priceView.html(this.priceTemplate(this.model.toJSON()));
    this.$numberInput.val(this.model.get("number"));
  },

  setNumber(number) {
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
        this.setNumber(this.checkNum(number));
        this.comboId = setTimeout(() => {
          this.combo(100);
        },delay);
      }
    }
  },

  validateNum(number) {
    const limitNum = this.model.get("limitNum");
    const minNum = this.model.get("minNum");
    let result = true;
    if(number > limitNum){
      toast("已到单笔订单数量上限", 1500);
      result = false;
    }else if(number < minNum){
      result = false;
    }
    return result;
    // return number <= limitNum && number >= minNum;
  },

  checkNum(number) {
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

  beginTouch(e) {
    // 开始连续增减模式
    this.computeMode = $(e.currentTarget).data("operator");
    this.comboMode = true;
    window.clearTimeout(this.comboId);
    this.combo(500);
  },

  endTouch() {
    // 结束连续增减模式
    this.comboMode = false;
  },

  inputKeyUp() {
    const val = this.$numberInput.val();
    if ( !val || isNaN(val)) {
      return ;
    }
    if (val !== "") {
      return this.setNumber(this.checkNum(val));
    }
  },

  inputKeyDown(e) {
    if ( e.which !== 8 && (e.which < 48 || e.which > 57 ) ) {
      e.preventDefault();
      return;
    }
  },

  inputBlur() {
    const val = this.$numberInput.val();
    if ( !val || isNaN(val) ) {
      return this.setNumber(1);
    }
    return this.setNumber(val);
  },

  purchase() {
    switch(this.model.get("type")) {
      case 0:
        this.buy();
        break;
      case 1:
        this.pay();
        break;
    }
  },

  close() {
    if(this.model.get("closeAll")) {
      this.model.destroy();
    }else{
      this.model.set({
        type: 0,
        hasMask: false
      });
    }
  }

});
module.exports = BuyNumPanelView;
