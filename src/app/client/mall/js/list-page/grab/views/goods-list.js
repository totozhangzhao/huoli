var $        = require("jquery");
var Backbone = require("backbone");
var _        = require("lodash");

var widget   = require("app/client/mall/js/lib/common.js");
var mallUitl = require("app/client/mall/js/lib/util.js");
var tplUtil  = require("app/client/mall/js/lib/mall-tpl.js");

var BaseView   = require("app/client/mall/js/common/views/BaseView.js");

var GoodsItemView = BaseView.extend({

  template: require("app/client/mall/tpl/list-page/grab/record-goods.tpl"),

  initialize: function (options) {

  },

  render: function (data) {
    this.$el.html(this.template({
      dataList: data,
      appName: mallUitl.getAppName(),
      tplUtil: tplUtil
    }));
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
module.exports = GoodsItemView;
