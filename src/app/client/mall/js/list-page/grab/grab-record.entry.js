var $             = require("jquery");
var Backbone      = require("backbone");
var _             = require("lodash");
var Promise       = require("com/mobile/lib/promise/npo.js");

var mallPromise   = require("app/client/mall/js/lib/mall-promise.js");
var sendPost      = require("app/client/mall/js/lib/mall-request.js").sendPost;
var Util          = require("com/mobile/lib/util/util.js");
var tplUtil       = require("app/client/mall/js/lib/mall-tpl.js");
var mallUitl      = require("app/client/mall/js/lib/util.js");
var UrlUtil       = require("com/mobile/lib/url/url.js");

var logger        = require("com/mobile/lib/log/log.js");

var Goods         = require("app/client/mall/js/list-page/grab/collections/goods.js");
var GoodsItemView = require("app/client/mall/js/list-page/grab/views/goods-item.js");

require("app/client/mall/js/lib/common.js");

var AppView = Backbone.View.extend({
  el: "#main",
  events:{
  },

  initialize: function () {
    logger.track(mallUitl.getAppName() + "PV", "View PV", document.title);

    this.id = UrlUtil.parseUrlSearch().productid;
    this.$goods = new Goods();
    this.$goodsPannel = $("#goods-block", this.$el);
    this.listenTo(this.$goods, "add", this.addGoodsItem);
    this.fetchData();
  },

  fetchData: function () {
    var self = this;
    mallPromise.appInfo
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
    this.$goods.set(data);
    this.fixTpl();
    return this;
  },
  // 增加一个商品视图
  addGoodsItem: function (data) {
    var itemView = new GoodsItemView();
    this.$goodsPannel.append(itemView.render(data).el);
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