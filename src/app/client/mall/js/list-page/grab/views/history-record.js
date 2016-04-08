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
var GoodsItemView = require("app/client/mall/js/list-page/grab/views/goods-item.js");

var imgDelay      = require("app/client/mall/js/lib/common.js").imageDelay;
var ui            = require("app/client/mall/js/lib/ui.js");

require("app/client/mall/js/lib/common.js");

var AppView = Backbone.View.extend({

  tagName: "ul",

  events:{
  },

  initialize: function () {
    this.$initial = ui.initial().show();

    this.id = UrlUtil.parseUrlSearch().productid;
    this.$goodsPannel = this.$el;
    this.$goodsView   = new GoodsItemView({el: this.$goodsPannel});
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
    this.renderGoodsList(data);
    this.$initial.hide();
    return this;
  },

  renderGoodsList: function (data) {
    this.$goodsView.render(data);
    imgDelay();
  }
});
module.exports = AppView;
// new AppView();
