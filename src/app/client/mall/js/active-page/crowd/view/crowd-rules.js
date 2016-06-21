// var $         = require("jquery");
var _         = require("lodash");
var Backbone  = require("backbone");
var UrlUtil   = require("com/mobile/lib/url/url.js");
var sendPost  = require("app/client/mall/js/lib/mall-request.js").sendPost;
var widget    = require("app/client/mall/js/lib/common.js");
var mallPromise = require("app/client/mall/js/lib/mall-promise.js");

var AppView = Backbone.View.extend({
  el: "#crowd-rules",
  initialize: function(commonData) {
    _.extend(this, commonData);

    // 活动ID
    this.id = UrlUtil.parseUrlSearch().productid;
    this.title = this.$el.data("title");
    this.mallCrowdRules();
  },
  resume: function() {
    if (this.title) {
      widget.updateViewTitle(this.title);
    }
  },
  mallCrowdRules: function() {
    var self = this;

    mallPromise.getAppInfo()
      .then(function(userData) {
        var params = _.extend({}, userData.userInfo, {
          p: userData.deviceInfo.p,
          productid: self.id
        });

        return new Promise(function(resolve, reject) {
          sendPost("crowdResult", params, function(err, data) {
            if (err) {
              reject(err);
            } else {
              resolve(data);
            }
          });
        });
      })
      .then(function(data) {
        var tmpl = require("app/client/mall/tpl/active-page/crowd/rules.tpl");
        self.$el.html(tmpl({ data: data }));
      })
      .catch(mallPromise.catchFn);
  }
});

module.exports = AppView;
