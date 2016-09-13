// 赠言视图
import $ from "jquery";
import _ from "lodash";
import Backbone from "backbone";
import giftConfig from "app/client/mall/js/common/gift-config.js";
import template from "app/client/mall/tpl/detail-page/gift/gift-message.tpl";
let AppView = Backbone.View.extend({

  tagName: "div",

  className: "giving-word-area",

  events: {
    "focus textarea.postscript": "focusHanlder",
    "blur textarea.postscript": "blurHanlder"
  },

  initialize(options) {
    this.parentDom = $(options.parentDom);
    this.$el.html(template({
      giftConfig
    }));
  },

  render() {
    this.parentDom.html(this.$el);
  },

  getTextarea() {
    return this.$el.find("textarea.postscript");
  },

  focusHanlder(e) {
    let dom = $(e.currentTarget);
    if(this.equalMsg()) {
      dom.val('');
      dom.removeClass('on');
    }
  },

  equalMsg() {
    return this.getGiftMessage() === giftConfig.defaultMessage;
  },

  isBlank() {
    return _.trim(this.getTextarea().val()) === "";
  },

  blurHanlder(e) {
    let d = $(e.currentTarget);
    if(this.isBlank()) {
      d.val(giftConfig.defaultMessage);
      d.addClass('on');
    }
  },

  getGiftMessage() {
    let msg = this.getTextarea().val();
    return _.trim(msg);
  }

});

export default AppView;
