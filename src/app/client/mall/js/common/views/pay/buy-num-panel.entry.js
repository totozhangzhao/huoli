var $             = require("jquery");
var Backbone      = require("backbone");
var _             = require("lodash");

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
    var buyView = new BuyPanelView({
      model: buyNumModel,
      exchange: function (){    // 立即兑换
        buyNumModel.set("type",1);
      },
      buy: function () {        // 立即购买
        buyNumModel.set("type",1);
      },
      pay: function () {}      // 去支付
    });

  }
});

new AppView();
