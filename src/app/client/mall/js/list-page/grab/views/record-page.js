import Backbone from "backbone";
import logger from "com/mobile/lib/log/log.js";
import mallUitl from "app/client/mall/js/lib/util.js";
import HistroyView from "app/client/mall/js/list-page/grab/views/history-record.js";
import MyRecordView from "app/client/mall/js/list-page/grab/views/my-record.js";
import NavView from "app/client/mall/js/list-page/grab/views/record-nav.js";
import BaseView from "app/client/mall/js/common/views/BaseView.js";

const app = BaseView.extend({

  el:"#main",

  events: {
    "click .js-new-page": "createNewPage",
    "click .js-get-url" : "handleGetUrl"
  },

  initialize() {
    // new Footer().render();
    this.navView = new NavView();
    this.ViewDic = {
      "record": {view:HistroyView,title:"最近开奖"},
      "my-record": {view:MyRecordView,title:"我参与纪录"}
    };
    this.views = {};
  },

  changeView(action) {
    if(action in this.ViewDic) {
      const isLoaded = !!this.views[action];
      if(!isLoaded){
        this.views[action] = new this.ViewDic[action].view();
      }
      this.render(action);
      this.navView.update(action);
      logger.track(`${mallUitl.getAppName()}PV`, "View PV", this.ViewDic[action].title);
    } else {
      window.console.log(`-- [Backbone View] not found! action: ${action} --`);
      this.switchTo("record", true, true);
    }
  },

  render(action) {
    this.$el.find("#list-box").html(this.views[action].el);
  },

  switchTo(view, trigger, replace) {
    Backbone.history.navigate(view,{
      trigger: !!trigger,
      replace: !!replace
    });
  }
});
export default app;
