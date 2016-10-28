import * as mallUtil from "app/client/mall/js/lib/util.js";
import ui from "app/client/mall/js/lib/ui.js";
import * as widget from "app/client/mall/js/lib/common.js";
import logger from "com/mobile/lib/log/log.js";
import BaseView from "app/client/mall/js/common/views/BaseView.js";
// import Footer from "app/client/mall/js/common/views/footer.js";
import Navigator from "app/client/mall/js/common/views/header/navigator.js";

const AppView = BaseView.extend({
  el: "#notfond-main",

  events:{
  },

  initialize() {
    const nav = new Navigator();
    nav.render();
    const title = "商品已下架";
    widget.updateViewTitle(title);

    this.$initial       = ui.initial().show();
    // this.$footer        = new Footer();
    this.render();
    logger.track(`${mallUtil.getAppName()}PV`, "View PV", title);
  },

  render() {
    // this.$footer.render();
    this.$initial.hide();
    return this;
  }

});

new AppView();
