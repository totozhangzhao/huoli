/*
  首页顶部固定入口位
*/
var Backbone = require("backbone");
var tplUtil  = require("app/client/mall/js/lib/mall-tpl.js");
var mallUitl = require("app/client/mall/js/lib/util.js");

var EntranceView = Backbone.View.extend({

  el: "#home-entrance",

  template: require("app/client/mall/tpl/home/v2/entrance.tpl"),

  initialize: function () {},

  render: function (data) {
    if(!data.length || data.length === 0){
      this.$el.hide();
      return;
    }
    var firstLineLength = data.length > 5 && data.length < 9 ? 4 : 5;
    this.$el.html(this.template({
      dataList: data.slice(0,firstLineLength),
      moreDataList: data.slice(firstLineLength),
      appName: mallUitl.getAppName(),
      tplUtil: tplUtil
    })).show();
    return this;
  }
});

module.exports = EntranceView;
