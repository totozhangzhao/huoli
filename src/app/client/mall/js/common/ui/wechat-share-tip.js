import $ from "jquery";
import Backbone from "backbone";
// import Util from "com/mobile/lib/util/util.js";
// import * as mallUitl from "app/client/mall/js/lib/util.js";
import template from "app/client/mall/tpl/common/ui/wechat-share-tip.tpl";
const ShareTipView = Backbone.View.extend({

  tagName: 'div',

  className: 'common-shadow improve-zindex',

  events: {
    "click": "hide"
  },

  initialize(options) {
    this.parentDom = $(options.parentDom);
    this.$el.html(template());
  },

  render() {
    this.parentDom.append(this.$el);
    return this;
  },

  show() {
    this.$el.show();
  },

  hide() {
    this.$el.hide();
  }
});
export default ShareTipView;
