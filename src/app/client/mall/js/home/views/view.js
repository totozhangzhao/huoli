/*
  首页视图
*/
var $           = require("jquery");
var Backbone    = require("backbone");
var _           = require("lodash");

var mallPromise = require("app/client/mall/js/lib/mall-promise.js");
var sendPost    = require("app/client/mall/js/lib/mall-request.js").sendPost;
var widget      = require("app/client/mall/js/lib/common.js");
var toast       = require("com/mobile/widget/hint/hint.js").toast;
var BaseView = Backbone.View.extend({
  events: {
    "click .js-new-page": "createNewPage",
    "click .js-get-url" : "handleGetUrl"
  },
  createNewPage: function (e) {
    widget.createAView(e);
  },
  handleGetUrl: function(e) {
    mallPromise.appInfo
    .then(function (userData) {
      var params = _.extend({}, userData.userInfo, userData.deviceInfo, {
        productid: $(e.currentTarget).data("productid")
      });

      sendPost("getUrl", params, function(err, data) {
        if (err) {
          toast(err.message, 1500);
          return;
        }

        widget.createNewView({
          url: data.url
        });
      });
    })
    .catch(mallPromise.catchFn);
  }
});

module.exports = BaseView;