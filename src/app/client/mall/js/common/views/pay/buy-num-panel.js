import $ from "jquery";
import Backbone from "backbone";
import {toast} from "com/mobile/widget/hint/hint.js";

const BuyNumPanelView = Backbone.View.extend({

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
    "click .js-goods-pay"        : "purchase"
  },

  initialize(options) {
    this.template = options.template || require("app/client/mall/tpl/common/buy-num-panel.tpl");
    this.priceTemplate = options.priceTemplate || require("app/client/mall/tpl/common/price-text.tpl");
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

    this.$avatarList = this.$el.find(".js-avatar-img");
    this.$priceView = this.$el.find(".js-goods-price-old");
    this.$unitPriceView = this.$el.find(".js-unit-price");
    this.$chargeBtn = this.$el.find(".js-goods-pay");
    this.$numberInput = this.$el.find(".js-goods-num-input");

    this.$priceView.html(this.priceTemplate(this.model.toJSON()));
    this.$chargeBtn
      .text(this.model.getPayBtnText())
      .data("payBtnType", this.model.getPayBtnText());
    return this;
  },

  refresh() {
    const model = this.model.toJSON();
    this.$numberInput.val(model.number);
    this.$priceView.html(this.priceTemplate(model));
    this.$unitPriceView.text(this.model.getPPriceText(1));
    if(this.model.has("refresh")) {
      try{
        this.model.get("refresh")();
      }catch(e) {
        window.console.log(e);
      }
    }
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

  inputKeyUp(e) {
    // const val = this.$numberInput.val();
    const val = $(e.currentTarget).val();
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

    this.$el
      .find(".js-spec")
        .removeClass("on");
    $cur.addClass("on");

    const index = $cur.data("index");

    this.$avatarList
      .hide()
      .eq(index)
        .show();

    // TODO: 判断最大数量

    this.specList = this.specList || this.model.get("specList");
    const spec = this.specList[index];

    // goodspecid int 商品规格id
    // spec String 商品规格值
    // price float 商品价格
    // points int 商品积分
    // left int 可买数量
    // oriprice float 商品原价
    // paytype int 支付类型
    // img float 规格图片
    this.model.set({
      specIndex: index,
      specId: spec.goodspecid,
      payType: spec.paytype,
      points: spec.points,
      price: spec.price,
      smallimg: spec.img,
      limitNum: spec.left
    }, { silent: true });
    this.refresh();
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
