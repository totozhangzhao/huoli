/*
  首页顶部固定入口位
*/
var $        = require("jquery");
var _        = require("lodash");

var tplUtil  = require("app/client/mall/js/lib/mall-tpl.js");
var mallUitl = require("app/client/mall/js/lib/util.js");

var BaseView    = require("app/client/mall/common/views/BaseView.js");
var EntranceView = BaseView.extend({

  el: "#home-entrance",

  template: require("app/client/mall/tpl/home/v2/entrance.tpl"),

  initialize: function () {},

  render: function (data) {
    if(!data.length){
      this.$el.hide();
      return;
    }
    this.$el.html(this.template({
      dataList: data,
      appName: mallUitl.getAppName(),
      tplUtil: tplUtil
    })).show();
    return this;
  }
});

module.exports = EntranceView;