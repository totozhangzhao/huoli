var $         = require("jquery");
// var _         = require("lodash");
var Backbone  = require("backbone");

import * as mallUtil from "app/client/mall/js/lib/util.js";
import * as mallWechat from "app/client/mall/js/lib/wechat.js";

import {shareInfo} from "app/client/mall/js/active-page/active/20161215/utils/config.js";
import template from "app/client/mall/tpl/active-page/active/20161215/info.tpl";
const InfoView = Backbone.View.extend({
  el: "#info",

  events: {
    'touchstart .panel-bar': "touchStart",
    "touchend .panel-bar": "touchEnd",
    "touchmove .panel-bar": "touchMove",
    "click .js-show-rule-info": "showRuleInfo",
    "click .js-hide-rule-info": "hideRuleInfo"
  },

  initialize: function(commonData) {
    this.util = commonData;
    this.pageIndex = 2;
    window.aaa= this;
  },

  render() {
    this.$el.html(template());
    mallUtil.forbiddenScroll();
    this.canTouch = true;
  },

  resume() {
    this.pageIndex = 2;
    this.render();
    this.initShare();
    this.next();
  },

  initShare() {
    if( !mallUtil.isAppFunc() ) {
      mallWechat.initShare({
        wechatshare: shareInfo,
        title: shareInfo.title
      });
    }
  },

  touchStart() {
    this.startY = 0;
  },

  touchMove(e) {
    if(this.startY === 0) {
      this.startY = e.touches[0].pageY;
    }
    this.endY = e.touches[0].pageY;
  },

  touchEnd() {
    // window.console.log(this.startY);
    // window.console.log(this.endY);
    if( (this.startY - this.endY) > $(window).height() * .25 ) {
      this.next();
    }
    this.startY = 0;
    this.endY = 0;
  },

  next() {
    if(this.canTouch) {
      if(this.pageIndex > 8) {
        return this.toLuckDrawPage();
      }

      $(`.panel-bar[data-panel-index!="${this.pageIndex}"]`, this.$el).removeClass("active");
      $(`.panel-bar[data-panel-index="${this.pageIndex}"]`, this.$el).addClass("active");
      this.pageIndex ++;
    }
  },

  toLuckDrawPage() {
    Backbone.history.navigate("luck-draw", {
      trigger: true,
      replace: true
    });
  },

  showRuleInfo() {
    this.canTouch = false;
    mallUtil.allowScroll();
    $("#rule-info-container", this.$el).show();
  },

  hideRuleInfo() {
    this.canTouch = true;
    mallUtil.forbiddenScroll();
    $("#rule-info-container", this.$el).hide();
  }
});

export default InfoView;
