// var $             = require("jquery");
// var Backbone      = require("backbone");
// var _             = require("lodash");
// var Promise       = require("com/mobile/lib/promise/npo.js");

// var NativeAPI     = require("app/client/common/lib/native/native-api.js");
// var mallPromise   = require("app/client/mall/js/lib/mall-promise.js");
// var sendPost      = require("app/client/mall/js/lib/mall-request.js").sendPost;
// var Util          = require("com/mobile/lib/util/util.js");
// var mallUitl      = require("app/client/mall/js/lib/util.js");
// var UrlUtil       = require("com/mobile/lib/url/url.js");
// var ui            = require("app/client/mall/js/lib/ui.js");

// var logger        = require("com/mobile/lib/log/log.js");

// Views
import GroupListView  from "app/client/mall/js/menu/promotion/views/groups-view.js";
import BannerView     from "app/client/mall/js/menu/promotion/views/banner-view.js";
import RuleView       from "app/client/mall/js/menu/promotion/views/rule-view.js";
// var Footer        = require("app/client/mall/js/common/views/footer.js");
import BaseView       from "app/client/mall/js/common/views/BaseView.js";

require("app/client/mall/js/lib/common.js");

var AppView = BaseView.extend({
  el: "#main",

  events: {
    "click .js-new-page": "createNewPage",
    "click .js-get-url" : "handleGetUrl"
  },

  initialize() {
    this.bannerView = new BannerView();
    this.groupView  = new GroupListView();
    this.ruleView   = new RuleView();

    this.fetchData();
  },

  fetchData() {
    this.result = this.getTestData();
    this.render();
  },

  render() {
    this.bannerView.render(this.result);
    this.groupView.render(this.result.goods);
    this.ruleView.render(this.result);
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
