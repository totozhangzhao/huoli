var parseUrl   = require("com/mobile/lib/url/url.js").parseUrlSearch;
var widget     = require("app/client/mall/js/lib/common.js");

var mallUitl   = require("app/client/mall/js/lib/util.js");
var ui         = require("app/client/mall/js/lib/ui.js");

var logger     = require("com/mobile/lib/log/log.js");
var menuLog    = require("app/client/mall/js/lib/common.js").initTracker("menu");

// models
var StateModel = require("app/client/mall/js/common/models/state.js");

// views
var BaseView   = require("app/client/mall/js/common/views/BaseView.js");
var GoodsView  = require("app/client/mall/js/common/views/index-goods.js");
var Footer     = require("app/client/mall/js/common/views/footer.js");

var AppView = BaseView.extend({
  el: "#main",

  events: {
    "click .js-new-page": "createNewPage",
    "click .js-get-url" : "handleGetUrl"
  },

  initialize: function() {
    var title       = parseUrl().title || document.title;
    this.$initial = ui.initial().show();
    this.groupId    = parseUrl().groupId;
    this.stateModel = new StateModel();
    this.$footer    = new Footer();
    this.$goodsView = new GoodsView({model: this.stateModel});
    this.listenTo(this.stateModel, "change", this.stateChange);
    this.render();
    logger.track(mallUitl.getAppName() + "PV", "View PV", title);
  },

  render: function () {
    this.stateModel.set({
      status: 1,
      groupId: this.groupId
    });
    this.$footer.render();
    return this;
  },

  stateChange: function (e) {
    if(e.hasChanged("status") && e.get("status") !== 1){
      this.$initial.hide();
      this.logger(e.get("title") || document.title);
    }
    // 数据加载完成
  },

  logger: function (title) {
    widget.updateViewTitle(title);
    menuLog({
      productid: this.groupId,
      title: title,
      from: parseUrl().from || "--"
    });
  }
});

new AppView();
