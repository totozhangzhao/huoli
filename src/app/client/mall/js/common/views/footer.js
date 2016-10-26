import $ from 'jquery';
import Util from "com/mobile/lib/util/util.js";
import * as mallUtil from "app/client/mall/js/lib/util.js";
import * as widget from "app/client/mall/js/lib/common.js";
import BaseView from "app/client/mall/js/common/views/BaseView.js";

const Footer = BaseView.extend({

  el: '#copyright',

  events: {
    "click .js-new-page-footer": "toNewView"
  },

  template: require("app/client/mall/tpl/common/footer/copyright.tpl"),
  crowdTemplate: require("app/client/mall/tpl/common/footer/crowd.tpl"),
  initialize() {
  },

  render() {

    this.$el.html(this.template({
      system: Util.getMobileSystem(),
      isHangbanFunc: mallUtil.isHangbanFunc()
    }));
    return this;
  },

  renderCrowd() {
    this.$el.html(this.crowdTemplate({
      system: Util.getMobileSystem(),
      isHangbanFunc: mallUtil.isHangbanFunc()
    }));
    return this;
  },

  toNewView(e) {
    let options = {url: $(e.currentTarget).attr('href')};
    widget.createNewView(options);
  }
});
module.exports = Footer;
