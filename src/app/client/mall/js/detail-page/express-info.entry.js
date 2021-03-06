var $         = require("jquery");
var Backbone  = require("backbone");
var NativeAPI = require("app/client/common/lib/native/native-api.js");
var toast     = require("com/mobile/widget/hint/hint.js").toast;
var UrlUtil   = require("com/mobile/lib/url/url.js");
var logger    = require("com/mobile/lib/log/log.js");
var mallUtil  = require("app/client/mall/js/lib/util.js");
var ui        = require("app/client/mall/js/lib/ui.js");
import BackTop from "com/mobile/widget/button/to-top.js";
import Navigator from "app/client/mall/js/common/views/header/navigator.js";
require("app/client/mall/js/lib/common.js");

var AppView = Backbone.View.extend({
  el: "#express-info",
  initialize: function() {
    const nav = new Navigator();
    nav.render();
    new BackTop();
    NativeAPI.invoke("updateTitle", {
      text: "物流信息"
    });

    this.$initial = ui.initial().show();
    this.showExpressInfo();
    logger.track(mallUtil.getAppName() + "PV", "View PV", document.title);
  },
  showExpressInfo: function() {
    var self = this;
    var urlData = UrlUtil.parseUrlSearch();
    var url = "/bmall/express/?companyid=" + urlData.companyid +
      "&tracking=" + urlData.tracking;

    $.ajax({
      type    : "GET",
      url     : url,
      dataType: "json"
    })
      .done(function(expressInfo) {
        self.render(expressInfo);
        self.$initial.hide();
      })
      .fail(function() {
        toast("( >﹏< ) 物流信息返回异常", 1500);
      });
  },

  render(expressInfo) {
    var infoList = expressInfo.data;
    if ( Array.isArray(infoList) && infoList.length > 0 ) {
      this.renderExpressInfo(expressInfo);
    } else {
      this.showMessage();
      // toast("暂无物流信息", 1500);
      // toast(expressInfo.message || "暂无物流信息", 5000);
    }
  },

  renderExpressInfo(expressInfo) {
    var infoList = expressInfo.data;
    if ( Array.isArray(infoList) && infoList.length > 0 ) {
      var firstT = new Date(infoList[0].time).getTime();
      var lastT  = new Date(infoList[infoList.length - 1].time).getTime();

      if (firstT < lastT) {
        infoList.reverse();
      }
      var $expressBox = this.$el;
      var compiled = require("app/client/mall/tpl/detail-page/express-info.tpl");
      var tmplData = {
        company : UrlUtil.parseUrlSearch().company,
        tracking: UrlUtil.parseUrlSearch().tracking,
        infoList: infoList
      };

      $expressBox.html( compiled(tmplData) );
    }
  },

  // 没有物流信息时现实背景图
  showMessage() {
    this.$el.html($('<img class="express-empty" src="http://cdn.rsscc.cn/guanggao/img/icon/express-empty.png" alt="">'));
  }
});

new AppView();
