var _           = require("lodash");
var BaseView    = require("app/client/mall/js/common/views/BaseView.js");
var tplUtil     = require("app/client/mall/js/lib/mall-tpl.js");

require("app/client/mall/js/lib/common.js");

var AppView = BaseView.extend({
  el: "#coupon-detail",
  events: {
    "click .js-new-page": "createNewPage",
    "click .js-get-url" : "handleGetUrl"
  },
  initialize: function(commonData) {
    _.extend(this, commonData);
  },
  resume: function() {
    var data = this.cache.couponList[this.cache.couponIndex];
    this.render(data);
  },
  render: function(data) {
    var tmpl = require("app/client/mall/tpl/profile/coupon-detail.tpl");
    this.$el.html(tmpl({
      item: data,
      tplUtil: tplUtil
    }));
  }
});

module.exports = AppView;
