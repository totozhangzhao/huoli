import mallUitl       from "app/client/mall/js/lib/util.js";
import UrlUtil        from "com/mobile/lib/url/url.js";
import * as widget    from "app/client/mall/js/lib/common.js";
import logger         from "com/mobile/lib/log/log.js";
import ui             from "app/client/mall/js/lib/ui.js";

// Views
import GroupListView  from "app/client/mall/js/menu/promotion/views/groups-view.js";
import BannerView     from "app/client/mall/js/menu/promotion/views/banner-view.js";
import RuleView       from "app/client/mall/js/menu/promotion/views/rule-view.js";
// var Footer        = require("app/client/mall/js/common/views/footer.js");
import BaseView       from "app/client/mall/js/common/views/BaseView.js";
import {getTestData}  from "app/client/mall/js/menu/promotion/test/data.js";

import Promise        from "com/mobile/lib/promise/npo.js";

var AppView = BaseView.extend({
  el: "#main",

  events: {
    "click .js-new-page": "createNewPage",
    "click .js-get-url" : "handleGetUrl"
  },

  initialize() {
    let title = UrlUtil.parseUrlSearch().title;
    widget.updateViewTitle(title);

    this.bannerView = new BannerView();
    this.groupView  = new GroupListView();
    this.ruleView   = new RuleView();
    this.$initial = ui.initial().show();
    this.fetchData();

    logger.track(mallUitl.getAppName() + "PV", "View PV", title);
  },

  fetchData() {
    this.result = this.getTestData();
    this.render();
  },

  render() {
    this.bannerView.render(this.result);
    this.groupView.render(this.result.goods);
    this.ruleView.render(this.result);
    this.$initial.hide();
  },


  getTestData(){
    var a = 1;
    var promise = new Promise(function(resolve, reject) {
      if(a === 1){
        setTimeout(function () {
          resolve(123);
        },1000);
      }else{
        reject();
      }


    });
    promise.then(function (data){
      window.console.log(data);
    });
    return getTestData();
  }

});

new AppView();
