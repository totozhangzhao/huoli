import Util from "com/mobile/lib/util/util.js";
import mallUitl from "app/client/mall/js/lib/util.js";
import BaseView from "app/client/mall/js/common/views/BaseView.js";

const Footer = BaseView.extend({

  el: '#copyright',

  events: {
    "click .js-new-page-footer": "createNewPage"
  },

  template: require("app/client/mall/tpl/common/footer/copyright.tpl"),
  crowdTemplate: require("app/client/mall/tpl/common/footer/crowd.tpl"),
  initialize() {
  },

  render() {

    this.$el.html(this.template({
      system: Util.getMobileSystem(),
      isHangbanFunc: mallUitl.isHangbanFunc()
    }));
    return this;
  },

  renderCrowd() {
    this.$el.html(this.crowdTemplate({
      system: Util.getMobileSystem(),
      isHangbanFunc: mallUitl.isHangbanFunc()
    }));
    return this;
  }
});
module.exports = Footer;
