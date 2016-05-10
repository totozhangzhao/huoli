var Backbone = require("backbone");
var mallUitl = require("app/client/mall/js/lib/util.js");
var tplUtil  = require("app/client/mall/js/lib/mall-tpl.js");
var imgDelay  = require("app/client/mall/js/lib/common.js").imageDelay;

var GoodsItemView = Backbone.View.extend({

  template: require("app/client/mall/tpl/menu/grab/goods-item.tpl"),


  initialize: function () {

  },

  render: function (data) {
    this.$el.html(this.template({
      dataList: data,
      appName: mallUitl.getAppName(),
      tplUtil  : tplUtil
    }))
    .show();
    imgDelay();
    return this;
  }
});
module.exports = GoodsItemView;
