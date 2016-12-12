import $ from "jquery";
import Backbone from "backbone";
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
    this.$el.css("background", "rgba(0,0,0,.8)");
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
