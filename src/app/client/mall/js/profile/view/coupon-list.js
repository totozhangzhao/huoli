var $           = require("jquery");
var _           = require("lodash");
var Backbone    = require("backbone");
var sendPost    = require("app/client/mall/js/lib/mall-request.js").sendPost;
var Promise     = require("com/mobile/lib/promise/npo.js");
var mallPromise = require("app/client/mall/js/lib/mall-promise.js");

require("app/client/mall/js/lib/common.js");

var AppView = Backbone.View.extend({
  el: "#coupon-list",
  events: {
    "click .js-item": "showCoupon"
  },
  initialize: function(commonData) {
    _.extend(this, commonData);
  },
  resume: function() {
    this.fetchData();
  },
  showCoupon: function(e) {
    this.cache.couponIndex = $(e.currentTarget).data("index");
    this.router.switchTo("coupon-detail");
  },
  fetchData: function() {
    var self = this;
    mallPromise.getAppInfo()
      .then(function(userData) {
        var params = _.extend({}, userData.userInfo, {
          p: userData.deviceInfo.p
        });

        return new Promise(function(resolve, reject) {
          sendPost("couponList", params, function(err, data) {
            if (err) {
              reject(err);
            } else {
              resolve(data);
            }
          });
        });
      })
      .then(function(data) {
        self.cache.couponList = data;
        self.render(data);
      })
      .catch(mallPromise.catchFn);
  },
  render: function(data) {
    var tmpl = require("app/client/mall/tpl/profile/coupon-list.tpl");
    this.$el.html(tmpl({
      couponList: data
    }));
  }
});

module.exports = AppView;
