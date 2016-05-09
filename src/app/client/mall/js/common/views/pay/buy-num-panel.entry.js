var BuyNumModel     = require("app/client/mall/js/common/models/buy-num-model.js");
var BuyPanelView = require("app/client/mall/js/common/views/pay/buy-num-panel.js");
var BaseView    = require("app/client/mall/js/common/views/BaseView.js");

var AppView = BaseView.extend({
  initialize: function () {
    var buyNumModel = new BuyNumModel({
      type: 0,
      title: "购买份数",
      limitNum: 99,
      showBuyTip: true,
      price: 1
    });
    new BuyPanelView({
      model: buyNumModel,
      buy: function (){    // 没有显示数量选择面板时，点击购买按钮的操作
        buyNumModel.set("type",1);
      },
      pay: function () {  // 显示数量选择面板时, 点击购买按钮的操作
        buyNumModel.set("type",0);
      }
    });
  }
});

new AppView();
