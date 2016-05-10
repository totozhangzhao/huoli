var Backbone      = require("backbone");
var logger       = require("com/mobile/lib/log/log.js");
var mallUitl     = require("app/client/mall/js/lib/util.js");

var HistroyView  = require("app/client/mall/js/list-page/grab/views/history-record.js");
var MyRecordView = require("app/client/mall/js/list-page/grab/views/my-record.js");
var NavView      = require("app/client/mall/js/list-page/grab/views/record-nav.js");
var BaseView = require("app/client/mall/js/common/views/BaseView.js");

var app = BaseView.extend({

  el:"#main",

  events: {
    "click .js-new-page": "createNewPage",
    "click .js-get-url" : "handleGetUrl"
  },

  initialize: function () {
    // new Footer().render();
    this.navView = new NavView();
    this.ViewDic = {
      "record": {view:HistroyView,title:"最近开奖"},
      "my-record": {view:MyRecordView,title:"我参与纪录"}
    };
    this.views = {};
  },

  changeView: function (action) {
    if(action in this.ViewDic) {
      var isLoaded = !!this.views[action];
      if(!isLoaded){
        this.views[action] = new this.ViewDic[action].view();
      }
      this.render(action);
      this.navView.update(action);
      logger.track(mallUitl.getAppName() + "PV", "View PV", this.ViewDic[action].title);
    } else {
      window.console.log("-- [Backbone View] not found! action: " + action + " --");
      this.switchTo("record", true, true);
    }
  },

  render: function (action) {
    this.$el.find("#list-box").html(this.views[action].el);
  },

  switchTo: function (view, trigger, replace){
    Backbone.history.navigate(view,{
      trigger: !!trigger,
      replace: !!replace
    });
  }
});
module.exports = app;
