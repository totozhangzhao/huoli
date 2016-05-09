var Backbone = require("backbone");
var mallUitl = require("app/client/mall/js/lib/util.js");
var tplUtil  = require("app/client/mall/js/lib/mall-tpl.js");
var imgDelay = require("app/client/mall/js/lib/common.js").imageDelay;

var GoodsListView = Backbone.View.extend({

  initialize: function () {

  },

  renderGoods: function (data) {
    this.$el.html(this.template({
      dataList: data,
      appName: mallUitl.getAppName(),
      tplUtil: tplUtil
    }));
    imgDelay();
    return this;
  },

  addMore: function (data){
    this.$el.append(this.template({
      dataList: data,
      appName: mallUitl.getAppName(),
      tplUtil: tplUtil
    }));

  }
});
module.exports = GoodsListView;
