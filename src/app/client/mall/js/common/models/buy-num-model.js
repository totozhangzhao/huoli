var $         = require("jquery");
var Backbone  = require("backbone");

var BuyNumModel = Backbone.Model.extend({
  defaults:{
    parentDom: "body",
    visible: false,            // 是否显示
    type: 1,                  // 0 不可选择数量， 1 可以选择数量
    showBuyTip: false,        // 是否显示一元夺宝的提示文案 （多买一份，中奖概率就增大一倍）暂时不支持文案内容配置
    hasMask: true,            // 是否有遮罩
    step: 1,                  // 按住加减每次改变的个数
    title: "购买数量",          // 标题
    payText: "立即购买",        // 购买按钮文案
    payNumText: "去支付",       // 可以选择数量的购买按钮文案
    number: 1,                 // 购买个数
    minNum: 1,                 // 最小购买数量
    limitNum: 99,              // 可购买数量
    price:0,                   // 价格单价
    currency: "元",            // 价格单位
    points:0,                  // 积分单价
    pointsUnit:"积分",          // 积分单位
    canPay: true,              // 购买按钮是否可用
    closeAll: false            // 点击关闭按钮时，是否关闭完整视图
  },

  // 获取显示的积分和价格文案
  getPPrice: function () {
    var result = "";
    result += this.getPointsText();
    if(result !== ""){
      result += "+";
    }
    result += this.getPriceText();
    return result;

  },
  // 获取显示的价格文案
  getPriceText: function () {
    var result = "";
    if(this.price > 0){
      result = this.number * this.price + this.currency;
    }
    return result;
  },
  // 获取显示的积分文案
  getPointsText: function () {
    var result = "";
    if(this.points > 0) {
      result = this.number * this.points + this.pointsUnit;
    }
    return result;
  },

  // 获取总价
  getTotalPrice: function () {
    return this.number * this.price;
  },

  // 获取总积分
  getTotalPoints: function () {
    return this.number * this.points;
  },

  getPriceType: function () {
    if(this.price > 0 && this.points > 0){
      return 0;
    }else if(this.price > 0) {
      return 1;
    }else if (this.points > 0){
      return 2;
    }
  },

  getPayBtnText: function () {
    // return this.get("type") === 1 ? "去支付" : this.get("price") > 0 ? "立即购买" : "立即兑换";
    return this.get("type") === 1 ? this.get("payNumText") : this.get("payText");
  }



});

module.exports = BuyNumModel;
