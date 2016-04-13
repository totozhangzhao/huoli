var $             = require("jquery");
var Backbone      = require("backbone");
var _             = require("lodash");
var Promise       = require("com/mobile/lib/promise/npo.js");

var mallPromise   = require("app/client/mall/js/lib/mall-promise.js");
var sendPost      = require("app/client/mall/js/lib/mall-request.js").sendPost;
var tplUtil       = require("app/client/mall/js/lib/mall-tpl.js");
var mallUitl      = require("app/client/mall/js/lib/util.js");
var UrlUtil       = require("com/mobile/lib/url/url.js");


var Goods         = require("app/client/mall/js/list-page/grab/collections/goods.js");
var ListBaseView  = require("app/client/mall/js/list-page/grab/views/base-list.js");

var ui            = require("app/client/mall/js/lib/ui.js");

require("app/client/mall/js/lib/common.js");

var AppView = ListBaseView.extend({

  tagName: "ul",

  className: "crowd-history-bar",

  template: require("app/client/mall/tpl/list-page/grab/record-goods.tpl"),

  events:{
  },

  initialize: function () {
    this.$initial = ui.initial().show();

    this.id = UrlUtil.parseUrlSearch().productid;
    this.fetchData();
  },

  fetchData: function () {
    var self = this;
    mallPromise.getAppInfo()
    .then(function (userData) {
      var params = _.extend({}, userData.userInfo, {
        productid: self.id
      });
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
    })
    .catch(mallPromise.catchFn);
  },

  render: function (data) {
    this.renderGoods(data);
    this.$initial.hide();
    return this;
  }
});
module.exports = AppView;
// new AppView();
