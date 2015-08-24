var $         = require("jquery");
var Backbone  = require("backbone");
var NativeAPI = require("app/client/common/lib/native/native-api.js");
var toast     = require("com/mobile/widget/hint/hint.js").toast;
var hint      = require("com/mobile/widget/hint/hint.js");
var UrlUtil   = require("com/mobile/lib/url/url.js");
var logger   = require("com/mobile/lib/log/log.js");
var mallUitl = require("app/client/mall/js/lib/util.js");

var AppView = Backbone.View.extend({
  el: "#express-info",
  initialize: function() {
    NativeAPI.invoke("updateTitle", {
      text: "物流信息"
    });

    this.showExpressInfo();
    logger.track(mallUitl.getAppName() + "PV", "View PV", document.title);
  },
  showExpressInfo: function() {
    hint.showLoading();

    var $expressBox = this.$el;
    var urlData = UrlUtil.parseUrlSearch();
    var url = "/bmall/express/?companyid=" + urlData.companyid +
      "&tracking=" + urlData.tracking;

    $.ajax({
      type    : "GET",
      url     : url,
      dataType: "json"
    })
      .done(function(expressInfo) {
        var infoList = expressInfo.data;

        if ( Array.isArray(infoList) ) {
          var firstT = new Date(infoList[0].time).getTime();
          var lastT  = new Date(infoList[infoList.length - 1].time).getTime();

          if (firstT < lastT) {
            infoList.reverse();
          }
        } else {
          toast("暂无物流信息", 1500);
          return;
        }

        var compiled = require("app/client/mall/tpl/detail-page/express-info.tpl");
        var tmplData = {
          company : UrlUtil.parseUrlSearch().company,
          tracking: UrlUtil.parseUrlSearch().tracking,
          infoList: infoList
        };

        $expressBox.html( compiled(tmplData) );
        hint.hideLoading();
      })
      .fail(function() {
        toast("网络异常", 1500);
      });
  }
});

new AppView(); 
