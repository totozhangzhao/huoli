/*
  首页顶部固定入口位
*/
var $         = require("jquery");
var _         = require("lodash");

var BaseView = require("app/client/mall/js/home/views/view.js");
var tplUtil  = require("app/client/mall/js/lib/mall-tpl.js");
var mallUitl = require("app/client/mall/js/lib/util.js");

var EntranceView = BaseView.extend({

  el: "#home-entrance",

  events: {
    "click .js-new-page": "createNewPage"
  },

  template: require("app/client/mall/tpl/home/v2/entrance.tpl"),

  initialize: function () {
  },

  render: function (data) {
    this.$el.hide();
    if(!data.length || data.length === 0){
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