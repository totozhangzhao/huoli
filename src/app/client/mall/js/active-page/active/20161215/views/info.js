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
    'touchstart .touch-dom': "touchStart",
    "touchend .touch-dom": "touchEnd"
  },

  initialize: function(commonData) {
    this.util = commonData;
  },

  render() {
    this.$el.html(template());
    mallUtil.forbiddenScroll();
  },

  resume() {
    this.render();
    this.initShare();
  },

  initShare() {
    if( !mallUtil.isAppFunc() ) {
      mallWechat.initShare({
        wechatshare: shareInfo,
        title: shareInfo.title
      });
    }
  },

  touchStart(e) {
    this.startY = e.pageY;
    // window.console.log(this.startY);
  },

  touchEnd(e) {
    this.endY = e.pageY;
    // window.console.log(this.endY);
    // window.console.log(this.startY - this.endY);
    if( (this.startY - this.endY) > $(window).height() * .25 ) {
      this.next();
    }
  },

  next() {
    window.console.log('next');
    this.toLuckDrawPage();
  },

  toLuckDrawPage() {
    Backbone.history.navigate("luck-draw", {
      trigger: true,
      replace: true
    });
  }
});

export default InfoView;
