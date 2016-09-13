import $ from "jquery";
import Backbone from "backbone";
import {parseUrlSearch as parseUrl} from "com/mobile/lib/url/url.js";
import logger from "com/mobile/lib/log/log.js";
import * as mallUitl from "app/client/mall/js/lib/util.js";
import * as filter from "app/client/mall/js/common/filter/filter.js";

/*
  @ opts.hideNavigator true 不显示顶部导航条
 */
export function createRouter(opts) {
  if (!opts) {
    throw new Error("Router Factory Error: Parameter Missing or Invalid.");
  }

  const viewDic = opts.viewDic;
  const defaultView = opts.defaultView;
  const cache = opts.cache || {};
  const model = opts.model || {};
  const collection = opts.collection || {};

  return Backbone.Router.extend({
    routes: {
      "": "default",
      ":action": "dispatch"
    },
    initialize() {
      this.bbViews = {};
      this.$panel = $(".bb-panel");
      this.previousView = "";
    },
    default() {
      const view = parseUrl().view;

      if (view in viewDic) {
        this.switchTo(view);
      } else {
        this.replaceTo(defaultView);
      }
    },

    // Dispatch pannels
    dispatch(action) {
      this.$panel
        .filter(".active")
          .removeClass("active")
        .end()
          .filter(`#${action}`)
            .addClass("active");

      const bbViews = this.bbViews;

      if ( viewDic[action] ) {
        if ( !bbViews[action] ) {
          bbViews[action] = new viewDic[action]({
            router: this,
            cache,
            model,
            collection
          });
        }

        filter.before(action);

        bbViews[action].resume({
          previousView: this.previousView
        });
        this.previousView = action;

        filter.after(action, {hideNavigator: opts.hideNavigator});
      } else {
        window.console.log(`-- [Backbone View] not found! action: ${action} --`);
        this.replaceTo(defaultView);
      }

      logger.track(`${mallUitl.getAppName()}PV`, "View PV", action);
    },
    switchTo(panelId) {
      this.navigate(panelId, {
        trigger: true
      });
    },
    replaceTo(panelId) {
      this.navigate(panelId, {
        trigger: true,
        replace: true
      });
    }
  });
}
