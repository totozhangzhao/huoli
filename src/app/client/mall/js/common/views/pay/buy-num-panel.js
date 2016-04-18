var $           = require("jquery");
var Backbone    = require("backbone");
var _           = require("lodash");


var BuyNumPanelView = Backbone.View.extend({

  tagName: "div",

  events: {
    "touchstart [data-operator]" : "beginTouch",
    "touchend [data-operator]"   : "endTouch",
    "keyup .number-input"        : "inputKeyUp",
    "keydown .number-input"      : "inputKeyDown",
    "blur .number-input"         : "inputBlur",
    "click .common-buy-close-btn": "close",
    "click .charge-btn"          : "purchase"
  },

  template: require("app/client/mall/tpl/common/buy-num-panel.tpl"),

  priceTemplate: require("app/client/mall/tpl/common/price-text.tpl"),

  initialize: function (options) {
    this.exchange = options.exchange || function (){};
    this.buy = options.buy || function () {};
    this.pay = options.pay || function () {};
    this.$el.appendTo('body');
    this.listenTo(this.model, "change", this.render);
    this.listenTo(this.model, "destroy", this.remove);
    window.aaaaa = this;
    this.render();
  },

  // 渲染视图
  render: function () {
    this.$el.html(this.template(this.model.toJSON()));
    this.$el.find(".goods-charge-bar .goods-charge-info").html(this.priceTemplate(this.model.toJSON()));
    this.$el.find(".charge-btn")
    .text(this.model.getPayBtnText())
    .data("payBtnType", this.model.getPayBtnText());
  },

  refresh: function () {
    this.$el.find(".goods-charge-bar .goods-charge-info").html(this.priceTemplate(this.model.toJSON()));
    this.$el.find(".number-input").val(this.model.get("number"));
  },

  setNumber: function (number) {
    this.model.set({number: number},{silent: true});
    this.refresh();
  },
  combo: function (delay) {
    if( this.comboMode ) {
      var number = this.model.get("number");
      if(this.computeMode === "add"){
        number++;
      }else{
        number--;
      }
      if(this.validateNum(number)){
        this.setNumber(this.checkNum(number));
        setTimeout(function () {
          this.combo(100);
        }.bind(this),delay);
      }
    }
  },

  validateNum: function (number) {
    var limitNum = this.model.get("limitNum");
    var minNum = this.model.get("minNum");
    return number <= limitNum && number >= minNum;
  },

  checkNum: function (number) {
    var limitNum = this.model.get("limitNum");
    var minNum = this.model.get("minNum");
    if(number > limitNum){
      number = limitNum;
    }else if(number < minNum){
      number = minNum;
    }
    return number;
  },

  beginTouch: function (e) {
    // 开始连续增减模式
    this.computeMode = $(e.currentTarget).data("operator");
    this.comboMode = true;
    this.combo(500);
  },

  endTouch: function () {
    // 结束连续增减模式
    this.comboMode = false;
  },

  inputKeyUp: function (e) {
    var val = this.$el.find(".number-input").val();
    if ( !val || isNaN(val)) {
      return ;
    }
    if (val !== "") {
      return this.setNumber(this.checkNum(val));
    }
  },

  inputKeyDown: function (e) {
    if ( e.which !== 8 && (e.which < 48 || e.which > 57 ) ) {
      e.preventDefault();
      return;
    }
  },

  inputBlur: function () {
    var val = this.$el.find(".number-input").val();
    if ( !val || isNaN(val) ) {
      return this.setNumber(1);
    }
    return this.setNumber(val);
  },

  purchase: function (e) {
    switch(this.model.get("type")) {
      case 0:
        this.buy();
        break;
      case 1:
        this.pay();
        break;
    }
  },

  close: function () {
    if(this.model.get("closeAll")) {
      this.model.destroy();
    }else{
      this.model.set({type: 0});
    }
  }

});

module.exports = BuyNumPanelView;
