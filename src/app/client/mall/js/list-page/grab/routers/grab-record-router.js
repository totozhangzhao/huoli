var $            = require("jquery");
var Backbone     = require("backbone");
var parseUrl     = require("com/mobile/lib/url/url.js").parseUrlSearch;
var logger       = require("com/mobile/lib/log/log.js");
var mallUitl     = require("app/client/mall/js/lib/util.js");

var HistroyView  = require("app/client/mall/js/list-page/grab/views/history-record.js");
var MyRecordView = require("app/client/mall/js/list-page/grab/views/my-record.js");
var App          = require("app/client/mall/js/list-page/grab/views/record-page.js");

var ViewDic = {
  "record": {view:HistroyView,title:""},
  "my-record": {view:MyRecordView,title:""}
};
module.exports = Backbone.Router.extend({
  routes: {
    "": "default",
    ":active": "dispatch"
  },
  initialize: function() {
    this.app = new App();
    this.views = {};
  },

  default: function () {
    this.switchTo("record");
  },

  dispatch: function (action) {
    if(action in ViewDic) {
      if(!this.views[action]){
        this.views[action] = new ViewDic[action].view();
      }
      this.app.render(this.views[action].el);
    } else {
      window.console.log("-- [Backbone View] not found! action: " + action + " --");
      this.switchTo("record");
    }
    logger.track(mallUitl.getAppName() + "PV", "View PV", ViewDic[action].title);
  },
  switchTo: function (view,replace) {
    this.navigate(view, {
      trigger: true,
      replace: !!replace
    });
  }
});
