var $         = require("jquery");
var Backbone  = require("backbone");
var parseUrl  = require("com/mobile/lib/url/url.js").parseUrlSearch;
var logger    = require("com/mobile/lib/log/log.js");
var mallUitl  = require("app/client/mall/js/lib/util.js");
var CrowdDetailView = require("app/client/mall/js/active-page/crowd/view/crowd-detail.js");
var CrowdRulesView  = require("app/client/mall/js/active-page/crowd/view/crowd-rules.js");

var ViewDic = {
  "crowd-detail": CrowdDetailView,
  "crowd-rules" : CrowdRulesView
};

var cache = {};
var model = {};
var collection = {};

module.exports = Backbone.Router.extend({
  routes: {
    "": "default",
    ":action": "dispatch"
  },
  initialize: function() {
    this.bbViews = {};
    this.$panel = $(".bb-panel");
    this.previousView = "";
  },
  default: function() {
    var view = parseUrl().view;
    
    if (view in ViewDic) {
      this.switchTo(view);
    } else {
      this.switchTo("crowd-detail");
    }
  },

  // Dispatch pannels
  dispatch: function(action) {
    this.$panel
      .filter(".active")
        .removeClass("active")
      .end()
        .filter("#" + action)
          .addClass("active");

    var bbViews = this.bbViews;

    if ( ViewDic[action] ) {
      bbViews[action]        = bbViews[action] || new ViewDic[action]();
      bbViews[action].router = this;
      bbViews[action].cache  = cache;
      bbViews[action].model  = model;
      bbViews[action].collection  = collection;
      bbViews[action].resume({
        previousView: this.previousView
      });
      this.previousView = action;
    } else {
      window.console.log("-- [Backbone View] not found! action: " + action + " --");
      this.switchTo("crowd-detail");      
    }

    logger.track(mallUitl.getAppName() + "PV", "View PV", action);
  },
  switchTo: function(panelId) {
    this.navigate(panelId, {
      trigger: true
    });
  }
});
