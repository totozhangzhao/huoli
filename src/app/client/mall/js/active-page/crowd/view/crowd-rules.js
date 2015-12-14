// var $         = require("jquery");
var _         = require("lodash");
var Backbone  = require("backbone");
var toast     = require("com/mobile/widget/hint/hint.js").toast;
var UrlUtil   = require("com/mobile/lib/url/url.js");
var appInfo   = require("app/client/mall/js/lib/app-info.js");
var sendPost  = require("app/client/mall/js/lib/mall-request.js").sendPost;
var Promise   = require("com/mobile/lib/promise/npo.js");
var widget    = require("app/client/mall/js/lib/widget.js");

var AppView = Backbone.View.extend({
  el: "#crowd-rules",
  initialize: function() {

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

    new Promise(function(resolve, reject) {
      appInfo.getUserData(function(err, userData) {
        if (err) {
          reject(err);
        } else {
          resolve(userData);
        }
      });
    }).then(function(userData) {
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
    }).then(function(data) {
      var tmpl = require("app/client/mall/tpl/active-page/crowd/rules.tpl");

      self.$el.html(tmpl({ data: data }));
    }).catch(function(err) {
      toast(err.message, 1500);
    });
  }
});

module.exports = AppView;
