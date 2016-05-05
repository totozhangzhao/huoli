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

// Views
var BannerView    = require("app/client/mall/js/menu/promotion/views/banner.js");
var ListGroupView = require("app/client/mall/js/menu/promotion/views/list-group.js");
var BottomView    = require("app/client/mall/js/menu/promotion/views/bottom.js");

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
    this.render();
  },

  render: function (data) {
    this.$el.html("render");
    return this;
  }

});

new AppView();
