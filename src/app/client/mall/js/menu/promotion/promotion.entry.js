var $             = require("jquery");
var Backbone      = require("backbone");
var _             = require("lodash");
var Promise       = require("com/mobile/lib/promise/npo.js");

var NativeAPI     = require("app/client/common/lib/native/native-api.js");
var mallPromise   = require("app/client/mall/js/lib/mall-promise.js");
var sendPost      = require("app/client/mall/js/lib/mall-request.js").sendPost;
var Util          = require("com/mobile/lib/util/util.js");
var mallUitl      = require("app/client/mall/js/lib/util.js");
var UrlUtil       = require("com/mobile/lib/url/url.js");
var ui            = require("app/client/mall/js/lib/ui.js");

var logger        = require("com/mobile/lib/log/log.js");

//collections
var Banners       = require("app/client/mall/js/menu/promotion/collections/banners.js");
var Groups        = require("app/client/mall/js/menu/promotion/collections/groups.js");

// Views
var BannerView    = require("app/client/mall/js/menu/promotion/views/banner-view.js");
var GroupListView = require("app/client/mall/js/menu/promotion/views/groups-view.js");
var BottomView    = require("app/client/mall/js/menu/promotion/views/bottom-view.js");

var Footer        = require("app/client/mall/js/common/views/footer.js");
var BaseView      = require("app/client/mall/js/common/views/BaseView.js");

require("app/client/mall/js/lib/common.js");

var AppView = BaseView.extend({
  el: "#main",

  events: {
    "click .js-new-page": "createNewPage",
    "click .js-get-url" : "handleGetUrl"
  },

  initialize: function () {
    this.$banners = new Banners();
    this.$groups  = new Groups();

    // this.bannerView = new BannerView({collection: this.$banners});
    // this.groupView  = new GroupListView({collection: this.$groups});
    // this.bottomView = new BottomView();

    // this.fetchData();
  },

  fetchData: function () {

var banners = [
{
  "img":"http://cdn.rsscc.cn/guanggao/img/gaotie/gt-index-banner-1000903.jpg?a=b",
  "title":"商品详情",
  "productid":1000903,
  "url":"/fe/app/client/mall/html/detail-page/goods-detail.html",
  "action":99,
  "groupId":0
},
{
  "img":"http://cdn.rsscc.cn/guanggao/img/gaotie/gt-index-banner-1000863.jpg",
  "title":"商品详情",
  "productid":1000863,
  "url":"/fe/app/client/mall/html/detail-page/goods-detail.html",
  "action":99,
  "groupId":0
},
{
  "img":"http://cdn.rsscc.cn/guanggao/img/gaotie/gt-index-banner-1000904.png",
  "title":"商品详情",
  "productid":1000904,
  "url":"/fe/app/client/mall/html/detail-page/goods-detail.html",
  "action":2,
  "groupId":0
}
];
var goods = [
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
    },
    {
        "title": {},
        "goods": [
            {
                "productid": 1001095,
                "title": "男士偏光太阳镜",
                "img": "http: //cdn.rsscc.cn/guanggao/img/gaotie/gt-common-goods-1001095.png",
                "points": 10,
                "money": 2,
                "action": 9,
                "groupId": 6
            },
            {
                "productid": 1000854,
                "title": "Jeep男士皮带",
                "img": "http: //cdn.rsscc.cn/guanggao/img/gaotie/gt-common-goods-1000854.png",
                "points": 10,
                "money": 2,
                "action": 9,
                "groupId": 6
            },
            {
                "productid": 1000905,
                "title": "无抵押信用贷款",
                "img": "http: //cdn.rsscc.cn/guanggao/img/gaotie/gt-common-goods-1000905.png",
                "points": 0,
                "money": 0,
                "url": "http: //center.95jr.com/index.aspx?a=110133&b=1&c=2100482&d=1110&z=eQRjyi",
                "action": 2,
                "groupId": 6
            },
            {
                "productid": 1000940,
                "title": "高清航拍四轴飞行器",
                "img": "http: //cdn.rsscc.cn/guanggao/img/gaotie/gt-common-goods-1000940.png",
                "points": 20,
                "money": 5,
                "action": 0,
                "groupId": 6
            }
        ]
    }
];
    this.$banners.set(banners,{lastIndex: banners.length - 1});
    this.$groups.set(goods, {lastIndex: goods.length - 1});

  }

});

new AppView();
