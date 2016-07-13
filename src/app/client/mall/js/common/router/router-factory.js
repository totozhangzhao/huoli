var $         = require("jquery");
var Backbone  = require("backbone");
var parseUrl  = require("com/mobile/lib/url/url.js").parseUrlSearch;
var logger    = require("com/mobile/lib/log/log.js");
var mallUitl  = require("app/client/mall/js/lib/util.js");
import * as mallWechat from "app/client/mall/js/lib/wechat.js";

exports.createRouter = function(opts) {
  if (!opts) {
    throw new Error("Router Factory Error: Parameter Missing or Invalid.");
  }

  var viewDic = opts.viewDic;
  var defaultView = opts.defaultView;
  var cache = opts.cache || {};
  var model = opts.model || {};
  var collection = opts.collection || {};

  return Backbone.Router.extend({
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

      if (view in viewDic) {
        this.switchTo(view);
      } else {
        this.replaceTo(defaultView);
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

      if ( viewDic[action] ) {
        if ( !bbViews[action] ) {
          bbViews[action] = new viewDic[action]({
            router: this,
            cache: cache,
            model: model,
            collection: collection
          });
        }

        bbViews[action].resume({
          previousView: this.previousView
        });

        if ( !/-detail|-desc/.test(action) ) {
          mallWechat.initShare();
        }

        this.previousView = action;
      } else {
        window.console.log("-- [Backbone View] not found! action: " + action + " --");
        this.replaceTo(defaultView);
      }

      logger.track(mallUitl.getAppName() + "PV", "View PV", action);
    },
    switchTo: function(panelId) {
      this.navigate(panelId, {
        trigger: true
      });
    },
    replaceTo: function(panelId) {
      this.navigate(panelId, {
        trigger: true,
        replace: true
      });
    }
  });
};
