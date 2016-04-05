/*
  首页推广位视图
*/
var $        = require("jquery");
var _        = require("lodash");

var tplUtil  = require("app/client/mall/js/lib/mall-tpl.js");
var mallUitl = require("app/client/mall/js/lib/util.js");

var BaseView    = require("app/client/mall/js/common/views/BaseView.js");

var PromotionView = BaseView.extend({

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
