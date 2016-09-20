// 赠言视图
import $ from "jquery";
import _ from "lodash";
import Backbone from "backbone";
import {toast} from "com/mobile/widget/hint/hint.js";
import giftConfig from "app/client/mall/js/common/gift-config.js";
import template from "app/client/mall/tpl/detail-page/gift/gift-message.tpl";
let AppView = Backbone.View.extend({

  tagName: "div",

  className: "giving-word-area",

  events: {
    "focus textarea.postscript": "focusHanlder",
    "blur textarea.postscript": "blurHanlder",
    "input textarea.postscript": "inputEventHanlder"
  },

  initialize(options) {
    this.parentDom = $(options.parentDom);
    this.$el.html(template({
      giftConfig
    }));
    this.showTip =_.throttle(function () {
      toast("限50个字，话不在多哦～", 1000);
    },2000);
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
  },

  inputEventHanlder(e) {
    if( $(e.currentTarget).val().length === 50 ) {
      this.showTip();
    }
  }



});

export default AppView;
