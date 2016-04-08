var $        = require("jquery");
var Backbone = require("backbone");
var _        = require("lodash");

var mallUitl = require("app/client/mall/js/lib/util.js");
var tplUtil  = require("app/client/mall/js/lib/mall-tpl.js");
var imgDelay  = require("app/client/mall/js/lib/common.js").imageDelay;

var BaseView   = require("app/client/mall/js/common/views/BaseView.js");

var GoodsItemView = BaseView.extend({

  template: require("app/client/mall/tpl/menu/grab/goods-item.tpl"),


  initialize: function (options) {

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
