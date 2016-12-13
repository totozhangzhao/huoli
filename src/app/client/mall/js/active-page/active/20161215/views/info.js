import $ from "jquery";
import _ from "lodash";
import Backbone from "backbone";

import * as mallUtil from "app/client/mall/js/lib/util.js";
import * as mallWechat from "app/client/mall/js/lib/wechat.js";
import * as config from "app/client/mall/js/active-page/active/20161215/utils/config.js";
import template from "app/client/mall/tpl/active-page/active/20161215/info.tpl";
import preLoadTemplate from "app/client/mall/tpl/active-page/active/20161215/preload.tpl";
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

  /**
   * 图片预加载
   */
  preLoad() {
    this.$el.html(preLoadTemplate());
    let preLoadStartTime = new Date();
    // 预加载最多十五秒，超过十五秒直接进入页面
    let preLoadId = setInterval(() => {
      if(new Date().getTime() - preLoadStartTime.getTime() > 15000) {
        this.render();
        this.next();
        clearInterval(preLoadId);
      }
    }, 1000);

    let imgBase = "http://cdn.rsscc.cn/guanggao/img/mall/active/leiling/";


    let count = 0;

    let loaded = () => {
      count ++;
      let p = ((count/config.imgList.length) * 100).toFixed(2);
      $(".progress-text", this.$el).text(`${p}%`);
      if(count === config.imgList.length) {
        clearInterval(preLoadId);
        setTimeout(() => {
          this.render();
          this.next();
        },500);
      }
    };
    _.forEach(config.imgList, (item) => {
      let img = new Image();
      img.onload = loaded;
      img.src = `${imgBase}${item}`;
    });
  },

  resume() {
    this.pageIndex = 2;
    this.preLoad();
    this.initShare();
  },

  initShare() {
    if( !mallUtil.isAppFunc() ) {
      mallWechat.initShare({
        wechatshare: config.shareInfo,
        title: config.shareInfo.title
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
