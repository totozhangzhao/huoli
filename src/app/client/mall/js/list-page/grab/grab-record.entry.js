var $                = require("jquery");
var Backbone         = require("backbone");
var _                = require("lodash");
var Promise       = require("com/mobile/lib/promise/npo.js");

var mallPromise   = require("app/client/mall/js/lib/mall-promise.js");
var sendPost      = require("app/client/mall/js/lib/mall-request.js").sendPost;
var Util     = require("com/mobile/lib/util/util.js");
var tplUtil       = require("app/client/mall/js/lib/mall-tpl.js");
var mallUitl      = require("app/client/mall/js/lib/util.js");
var UrlUtil   = require("com/mobile/lib/url/url.js");

var AppView = Backbone.View.extend({
  el: "#test",

  events:{
  },

  initialize: function () {
    this.id = UrlUtil.parseUrlSearch().productid;
    this.fetchData();
  },

  fetchData: function () {
    var self = this;
    mallPromise.appInfo
    .then(function (userData) {
      var params = _.extend({}, userData.userInfo, {
        productid: self.id
      });
      window.console.log(userData);
      return new Promise(function(resolve, reject) {
        sendPost("crowdWinList", params, function(err, data) {
          if (err) {
            reject(err);
          } else {
            resolve(data);
          }
        });
      });
    })
    .then(function (data) {
      self.render(data);
    });
  },

  render: function (data) {
    window.console.log(data);
    this.fixTpl();
    this.$el.html(JSON.stringify(data));
  },

  fixTpl: function() {
    var crTpl = require("app/client/mall/tpl/copyright.tpl");

    $("#copyright").html(crTpl({
      system: Util.getMobileSystem(),
      isHangbanFunc: mallUitl.isHangbanFunc()
    }));
  }

});
new AppView();