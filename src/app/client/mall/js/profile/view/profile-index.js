// var $           = require("jquery");
var _           = require("lodash");
var Backbone    = require("backbone");
var sendPost    = require("app/client/mall/js/lib/mall-request.js").sendPost;
var mallPromise = require("app/client/mall/js/lib/mall-promise.js");
var pageAction  = require("app/client/mall/js/lib/page-action.js");

require("app/client/mall/js/lib/common.js");

var AppView = Backbone.View.extend({
  el: "#profile-index",
  initialize: function(commonData) {
    _.extend(this, commonData);
    this.fetchData();
  },
  resume: function() {
    pageAction.hideRightButton();
  },
  fetchData: function() {
    var self = this;
    mallPromise.getAppInfo()
      .then(function(userData) {
        var params = _.extend({}, userData.userInfo, {
          p: userData.deviceInfo.p
        });

        return new Promise(function(resolve, reject) {
          sendPost("getUserInfo", params, function(err, data) {
            if (err) {
              reject(err);
            } else {
              resolve({
                points: data.points,
                level: data.level,
                phone: userData.userInfo.phone
              });
            }
          });
        });
      })
      .then(function(data) {
        self.render(data);
      })
      .catch(mallPromise.catchFn);
  },
  render: function(data) {
    var tmpl = require("app/client/mall/tpl/profile/user-level.tpl");
    this.$el.find(".js-top-container").html(tmpl(data));
  }
});

module.exports = AppView;
