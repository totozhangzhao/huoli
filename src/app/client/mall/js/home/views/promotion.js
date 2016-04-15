/*
  首页推广位视图
*/
var $        = require("jquery");
var Backbone = require("backbone");
var _        = require("lodash");

var tplUtil  = require("app/client/mall/js/lib/mall-tpl.js");
var mallUitl = require("app/client/mall/js/lib/util.js");

var PromotionView = Backbone.View.extend({

  el: "#home-promotion",

  template: require("app/client/mall/tpl/home/v2/promotion.tpl"),

  initialize: function (){},

  render: function (data) {
    if(!data.length || data.length === 0){
      this.$el.hide();
      return;
    }
    this.$el.html(this.template({
      dataList: data,
      appName : mallUitl.getAppName(),
      tplUtil : tplUtil
    }));
    return this;
  }
});

module.exports = PromotionView;
