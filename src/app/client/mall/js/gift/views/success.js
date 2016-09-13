// 领取成功页面
// import $ from "jquery";
import _ from "lodash";
import * as mallUitl       from "app/client/mall/js/lib/util.js";
import logger         from "com/mobile/lib/log/log.js";
import ui             from "app/client/mall/js/lib/ui.js";
import * as widget    from "app/client/mall/js/lib/common.js";
import pageAction from "app/client/mall/js/lib/page-action.js";
// Views
import BaseView       from "app/client/mall/js/common/views/BaseView.js";

// templates
import template from "app/client/mall/tpl/gift/success.tpl";

const defaultTitle = "微信送礼-领取成功";
const ReceiveView = BaseView.extend({

  el: "#success",

  events: {
    "click .js-new-page": "createNewPage",
    "click .js-get-url" : "handleGetUrl"
  },

  initialize(commonData) {
    _.extend(this, commonData);
    this.$initial = ui.initial().show();
    logger.track(`${mallUitl.getAppName()}PV`, "View PV", defaultTitle);
  },

  render() {
    this.$initial.hide();
    this.$el.html(template());
    return this;
  },


  resume(options) {
    if (options.previousView !== "receive") {
      setTimeout(() => {
        this.router.replaceTo("index");
        pageAction.setClose();
      }, 0);
      return;
    }
    widget.updateViewTitle(defaultTitle);
    this.render();
  }
});

export default ReceiveView;
