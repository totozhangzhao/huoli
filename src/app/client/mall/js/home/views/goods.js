/*
  首页商品视图
*/
var $         = require("jquery");
var _         = require("lodash");

var BaseView = require("app/client/mall/js/home/views/view.js");
var tplUtil  = require("app/client/mall/js/lib/mall-tpl.js");
var mallUitl = require("app/client/mall/js/lib/util.js");


var PromotionView = BaseView.extend({

  el: "#home-goods",

  events: {
    "click .js-new-page": "createNewPage"
  },

  template: require("app/client/mall/tpl/home/v2/goods.tpl"),

  initialize: function (){
  },

  render: function () {
    this.$el.html(this.template({
      appName  : mallUitl.getAppName(),
      tplUtil  : tplUtil
    }));
    return this;
  }
});

module.exports = PromotionView;