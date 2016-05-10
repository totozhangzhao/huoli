import mallUitl       from "app/client/mall/js/lib/util.js";
import UrlUtil        from "com/mobile/lib/url/url.js";
import {updateViewTitle}         from "app/client/mall/js/lib/common.js";
import logger         from "com/mobile/lib/log/log.js";
import ui             from "app/client/mall/js/lib/ui.js";

// Views
import GroupListView  from "app/client/mall/js/menu/promotion/views/groups-view.js";
import BannerView     from "app/client/mall/js/menu/promotion/views/banner-view.js";
import RuleView       from "app/client/mall/js/menu/promotion/views/rule-view.js";
// var Footer        = require("app/client/mall/js/common/views/footer.js");
import BaseView       from "app/client/mall/js/common/views/BaseView.js";


var AppView = BaseView.extend({
  el: "#main",

  events: {
    "click .js-new-page": "createNewPage",
    "click .js-get-url" : "handleGetUrl"
  },

  initialize() {
    let title = UrlUtil.parseUrlSearch().title;
    updateViewTitle(title);

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
    const activebanner = {
      "name":"",
      "bannerimg": "http://cdn.rsscc.cn/guanggao/img/secondary/gaotie/gt-10000194-1.png"
    };

    const rule = {
      "text": "",
      "ruleimg": "http://cdn.rsscc.cn/guanggao/img/secondary/gaotie/gt-10000194-1.png"
    };

    const goods = [
      {
        "title": {
          "title": "斤斤计较",
          "src": "https:/111.1.1.1"
        },
        "goods": [
          {
            "productid": 10000200,
            "title": "夏季多功能冰凉降温坐垫",
            "img": "http: //cdn.rsscc.cn/guanggao/img/gaotie/gt-common-goods-10000200.png",
            "points": 10,
            "money": 0,
            "action": 9,
            "groupId": 6
          },
          {
            "productid": 1001094,
            "title": "Jeep正品男士皮带优惠券",
            "img": "http: //cdn.rsscc.cn/guanggao/img/gaotie/gt-common-goods-1001094.png",
            "points": 10,
            "money": 2,
            "action": 9,
            "groupId": 6
          },
          {
            "productid": 1001083,
            "title": "不锈钢5碗5勺",
            "img": "http: //cdn.rsscc.cn/guanggao/img/gaotie/gt-common-goods-1001083.png",
            "points": 10,
            "money": 0,
            "action": 9,
            "groupId": 6
          },
          {
            "productid": 1000825,
            "title": "注册即送588元红包",
            "img": "http: //cdn.rsscc.cn/guanggao/img/gaotie/gt-common-goods-1000825.png?a=s",
            "points": 10,
            "money": 0,
            "action": 9,
            "groupId": 6
          }
        ]
      }
    ];
    return {activebanner, goods, rule};
  }

});

new AppView();
