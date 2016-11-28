import Backbone from "backbone";

const BuyNumModel = Backbone.Model.extend({
  defaults:{
    parentDom: "body",
    discount: 0,                 // 优惠金额  (当前用在一元夺宝夺宝币)
    visible: false,              // 是否显示
    type: 1,                     // 0 不可选择数量， 1 可以选择数量
    giftType: -1,                // 3 微信送礼
    payType: 2,                  // int 支付类型：1积分 2现金 3 积分+钱
    showBuyTip: false,           // 是否显示一元夺宝的提示文案 （多买一份，中奖概率就增大一倍）暂时不支持文案内容配置
    hasMask: true,               // 是否有遮罩
    step: 1,                     // 按住加减每次改变的个数
    title: "购买数量",            // 标题
    payText: "立即购买",          // 购买按钮文案
    payNumText: "去支付",         // 可以选择数量的购买按钮文案
    number: 1,                   // 购买个数
    minNum: 1,                   // 最小购买数量
    limitNum: 99,                // 可购买数量
    limitMessage: "已达数量上限", // 到达可购买数量上限时的提示
    price: 0,                    // 价格单价
    currency: "￥",              // 价格单位
    points: 0,                   // 积分单价
    pointsUnit: "积分",           // 积分单位
    specList: [],                // 规格(Array)
    specIndex: null,             // 当前选中的规格
    specName: null,              // 例如：颜色、尺码
    specValueName: null,         // 例如：白色、红色；X、XL、XXXL
    specValueId: null,           // 规格ID goodspecid
    avatar: "",                  // 当前商品头像
    canPay: true,                // 购买按钮是否可用
    showCollect: true,           // 是否有收藏按钮 商品详情页底部展示
    isCollect: 1,                // 1 未收藏  2 已收藏
    closeAll: false              // 点击关闭按钮时，是否关闭完整视图
  },

  // 获取显示的积分和价格文案
  getPPriceText(num, useDiscount) {
    let result = "";
    const payType = this.get("payType");
    switch(payType) {
      case 1:
        result = this.getPointsText(num);
        break;
      case 2:
        result = this.getPriceText(num, useDiscount);
        break;
      case 3:
        result = this.getPriceText(num, useDiscount) + "+" + this.getPointsText(num);
        break;
      default:
        result = "";
        break;
    }
    return result;
  },

  // 获取显示的价格文案
  getPriceText(num, useDiscount) {
    let discount = 0;
    if(useDiscount) {
      discount = this.get('discount');
    }
    let result = "";
    let number = num || this.get("number");
    let price = number * this.get("price");
    result = this.get("currency") + Number(price - discount).toFixed(2);
    return result;
  },

  // 获取显示价格的文案标签
  getPriceTpl(num, useDiscount) {
    let discount = 0;
    if(useDiscount) {
      discount = this.get('discount');
    }
    let result = "";
    let number = num || this.get("number");
    let price = number * this.get("price");
    result = `<span>${this.get("currency")}<span><span>${Number(price - discount).toFixed(2)}<span>`;
    return result;
  },

  // 获取价格积分文案模版
  getPPriceTpl(num, useDiscount) {
    let result = "";
    const payType = this.get("payType");
    switch(payType) {
      case 1:
        result = this.getPointsTpl(num);
        break;
      case 2:
        result = this.getPriceTpl(num, useDiscount);
        break;
      case 3:
        result = `${this.getPriceTpl(num, useDiscount)}<span>+<span>${this.getPointsTpl(num)}`;
        break;
      default:
        result = "";
        break;
    }
    return result;
  },

  // 获取显示的积分文案
  getPointsText(num) {
    let result = "";
    let number = num || this.get("number");
    result = number * this.get("points") + this.get("pointsUnit");
    return result;
  },

  // 获取显示积分的文案，带标签
  getPointsTpl(num) {
    let result = "";
    let number = num || this.get("number");
    result = `<span>${number * this.get("points")}</span><span>${this.get("pointsUnit")}</span>`;
    return result;
  },

  // 获取总价
  getTotalPrice() {
    return this.get("number") * this.get("price");
  },

  // 获取总积分
  getTotalPoints() {
    return this.get("number") * this.get("points");
  },

  getPriceType() {
    if(this.get("price") > 0 && this.get("points") > 0){
      return 0;
    }else if(this.get("price") > 0) {
      return 1;
    }else if (this.get("points") > 0){
      return 2;
    }
  },

  getPayBtnText() {
    // return this.get("type") === 1 ? "去支付" : this.get("price") > 0 ? "立即购买" : "立即兑换";
    return this.get("type") === 1 ? this.get("payNumText") : this.get("payText");
  }
});

module.exports = BuyNumModel;
