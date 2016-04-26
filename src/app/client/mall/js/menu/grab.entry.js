var $             = require("jquery");
var Backbone      = require("backbone");
var _             = require("lodash");
var Promise       = require("com/mobile/lib/promise/npo.js");

var NativeAPI     = require("app/client/common/lib/native/native-api.js");
var mallPromise   = require("app/client/mall/js/lib/mall-promise.js");
var sendPost      = require("app/client/mall/js/lib/mall-request.js").sendPost;
var Util          = require("com/mobile/lib/util/util.js");
var mallUitl      = require("app/client/mall/js/lib/util.js");
var UrlUtil       = require("com/mobile/lib/url/url.js");
var ui            = require("app/client/mall/js/lib/ui.js");

var logger        = require("com/mobile/lib/log/log.js");
var menuLog       = require("app/client/mall/js/lib/common.js").initTracker("menu");

var Goods         = require("app/client/mall/js/menu/collections/goods.js");
var GoodsItemView = require("app/client/mall/js/menu/views/goods-item.js");
var BannerView    = require("app/client/mall/js/menu/views/banner.js");
var WinnerView    = require("app/client/mall/js/menu/views/winner-label.js");
var Footer        = require("app/client/mall/js/common/views/footer.js");
var BaseView      = require("app/client/mall/js/common/views/BaseView.js");

require("app/client/mall/js/lib/common.js");

var AppView = BaseView.extend({
  el: "#main",

  events: {
    "click .js-new-page": "createNewPage",
    "click .js-get-url" : "handleGetUrl"
  },

  initialize: function () {
    this.$initial = ui.initial().show();

    logger.track(mallUitl.getAppName() + "PV", "View PV", document.title);

    this.id = UrlUtil.parseUrlSearch().productid;
    // 商品列表容器
    this.$goodsPannel = $("#goods-block", this.$el);
    this.goodsView = new GoodsItemView({el: this.$goodsPannel});
    this.$footer        = new Footer();
    // 商品数据集合
    // this.$goods = new Goods();
    // this.listenTo(this.$goods,"set",this.addGoodsItem);
    this.fetchData();

    NativeAPI.registerHandler("resume", function() {
      window.location.reload();
    });
  },

  fetchData: function () {
    var self = this;
    mallPromise.getAppInfo()
    .then(function (userData) {
      var params = _.extend({}, userData.userInfo, {
        productid: self.id
      });
      return new Promise(function(resolve, reject) {
        sendPost("crowdColumn", params, function(err, data) {
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
    this.initBanner(data.banner);
    this.initWinnerLabel(data.winner);
    // this.$goods.set(data.product);
    this.renderGoodsList(data.product);
    this.$footer.render();
    this.$initial.hide();
    menuLog({
      title: UrlUtil.parseUrlSearch().classify || window.document.title,
      from: UrlUtil.parseUrlSearch().from || "--"
    });
    return this;
  },

  // 增加一个商品视图
  addGoodsItem: function (data) {

    // var itemView = new GoodsItemView();
    // this.$goodsPannel.append(itemView.render(data).el);
  },

  // 加载商品列表
  renderGoodsList: function (data) {
    this.goodsView.render(data);
  },
  // 初始化banner
  initBanner: function(bannerData) {
    new BannerView({model: bannerData});
  },
  // 初始化获奖名单滚动显示条
  initWinnerLabel: function (winnerData) {
    new WinnerView({model: winnerData});
  }
});

new AppView();
