var $          = require("jquery");

var parseUrl   = require("com/mobile/lib/url/url.js").parseUrlSearch;
var widget     = require("app/client/mall/js/lib/common.js");

var Util       = require("com/mobile/lib/util/util.js");
var mallUitl   = require("app/client/mall/js/lib/util.js");

var logger     = require("com/mobile/lib/log/log.js");
var menuLog    = require("app/client/mall/js/lib/common.js").initTracker("menu");

// models
var StateModel = require("app/client/mall/common/models/state.js");

// views
var BaseView   = require("app/client/mall/common/views/BaseView.js");
var GoodsView  = require("app/client/mall/common/views/index-goods.js");
var Footer     = require("app/client/mall/common/views/footer.js");

var AppView = BaseView.extend({
  el: "#main",

  events: {},

  initialize: function() {
    var title       = parseUrl().title;
    widget.updateViewTitle(title);
    this.groupId    = parseUrl().groupId;
    this.stateModel = new StateModel();
    this.$footer    = new Footer();
    this.$goodsView = new GoodsView({model: this.stateModel});
    this.listenTo(this.model, "change", this.stateChange);
    this.render();
    logger.track(mallUitl.getAppName() + "PV", "View PV", title);
    menuLog({
      title: parseUrl().classify,
      from: parseUrl().from || "--"
    });
  },

  render: function () {
    this.stateModel.set({
      status: 1,
      groupId: this.groupId
    });
    this.$footer.render();
  },

  stateChange: function () {
    // 数据加载完成
  }
});

new AppView();