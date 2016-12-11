// var $         = require("jquery");
// var _         = require("lodash");
var Backbone  = require("backbone");
import * as mallUtil from "app/client/mall/js/lib/util.js";
import template from "app/client/mall/tpl/active-page/active/20161215/info.tpl";
const InfoView = Backbone.View.extend({
  el: "#info",

  events: {
    'touchstart .touch-dom': "touchStart",
    "touchend .touch-dom": "touchEnd"
  },

  initialize: function(commonData) {
    window.console.log(commonData);
  },

  render() {
    this.$el.html(template());
    mallUtil.forbiddenScroll();
  },

  resume() {
    this.render();
  },

  touchStart(e) {
    this.startY = e.pageY;
  },

  touchEnd(e) {
    this.endY = e.pageY;
    this.next();
  },

  next() {
    window.console.log(this.endY - this.startY);
    if( (this.endY - this.startY) < -100 ) {
      window.console.log('next');
    }
  }
});

export default InfoView;
