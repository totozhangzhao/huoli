var $           = require("jquery");
var Backbone    = require("backbone");
var _           = require("lodash");


var BuyNumPanelView = Backbone.View.extend({

  tagName: "div",

  events: {
    "touchstart [data-operator]" : "beginTouch",
    "touchend [data-operator]"   : "endTouch",
    "keyup input"                : "inputKeyUp",
    "keydown input"              : "inputKeyDown",
    "blur input"                 : "inputBlur"
  },

  template: require("app/client/mall/tpl/common/buy-num-panel.tpl"),

  priceTemplate: require("app/client/mall/tpl/common/price-text.tpl"),

  initialize: function () {
    this.$el.appendTo('body');
    this.listenTo(this.model, "change", this.render);

    window.aaaaa=this;
    this.render();
  },

  // 渲染视图
  render: function () {
    this.$el.html(this.template(this.model.toJSON()));
    this.$el.find(".goods-charge-bar .goods-charge-info").html(this.priceTemplate(this.model.toJSON()));
  },

  refresh: function () {
    this.$el.find(".goods-charge-bar .goods-charge-info").html(this.priceTemplate(this.model.toJSON()));
    this.$el.find("input").val(this.model.get("number"));
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
      if(this.checkNum(number)){
        this.setNumber(number);
        setTimeout(function () {
          this.combo(100);
        }.bind(this),delay);
      }
    }
  },

  checkNum: function (number) {
    var limitNum = this.limitNum;
    var minNum = 1;
    if(number > this.model.get("limitNum")){
      number = limitNum;
      return false;
    }else if(number < this.model.get("minNum")){
      number = minNum;
      return false;
    }
    return true;
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

  inputKeyUp: function () {

    var val = this.$el.find("input").val();
    if ( !val || isNaN(val) ) {
      return ;
    }

    if (val !== "") {
      return this.setNumber(val);
    }
  },

  inputKeyDown: function (e) {
    if ( e.which !== 8 && (e.which < 48 || e.which > 57 ) ) {
      e.preventDefault();
      return;
    }
  },

  inputBlur: function () {
    var val = this.$el.find("input").val();
    if ( !val || isNaN(val) ) {
      return this.setNumber(1);
    }
    return this.setNumber(val);
  }

});

module.exports = BuyNumPanelView;
