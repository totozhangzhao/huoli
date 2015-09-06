var $         = require("jquery");
var _          = require("lodash");
var Backbone  = require("backbone");
// var NativeAPI = require("app/client/common/lib/native/native-api.js");
var toast     = require("com/mobile/widget/hint/hint.js").toast;
var hint      = require("com/mobile/widget/hint/hint.js");
var UrlUtil   = require("com/mobile/lib/url/url.js");
var logger    = require("com/mobile/lib/log/log.js");
var mallUitl  = require("app/client/mall/js/lib/util.js");
var hint      = require("com/mobile/widget/hint/hint.js");
var async      = require("async");
var appInfo    = require("app/client/mall/js/lib/app-info.js");
var sendPost   = require("app/client/mall/js/lib/mall-request.js").sendPost;
var base64     = require("com/mobile/lib/base64/base64.js").Base64;

var AppView = Backbone.View.extend({
  el: "#main-container",
  events: {
    "click .js-add": "addUserInputs",
    "click .js-user-item-delete": "removeUserInputs",
    "click .js-submit": "submitOrder"
  },
  initialize: function() {

    // initial data from url
    this.urlInputs = this.parseUrlInputs();
    this.renderMainView(this.urlInputs);

    logger.track(mallUitl.getAppName() + "PV", "View PV", document.title);
  },
  parseUrlInputs: function() {
    var b64String = UrlUtil.parseUrlSearch().orderinfo;
    var str = "";

    if (b64String) {
      str = base64.decode(b64String);
      str = JSON.parse(str);
    }

    return str;
  },
  renderMainView: function(urlInputs) {
    var tickets = urlInputs.tickets;

    if ( !Array.isArray(tickets) || tickets.length === 0 ) {
      tickets = [{}];
    } else {

      // 可能没有 account 节点，没有登陆管家账号就没有
      var accountCardno = urlInputs.account && urlInputs.account.cardno;

      for (var i = 0, len = tickets.length; i < len; i += 1) {
        if ( accountCardno && tickets[i].cardno === accountCardno ) {
          tickets[i].phone = urlInputs.account.phone;
        }

        if ( !/身份证/.test(tickets[i].cardtype) ) {
          tickets[i].cardno = "";
        }
      }      
    }

    var tmpl = require("app/client/mall/tpl/active-page/insurance/input.tpl");

    this.$el
      .find(".js-inputs-container")
      .html(tmpl({
        tickets: tickets
      }));
  },
  addUserInputs: function() {
    var tmpl = require("app/client/mall/tpl/active-page/insurance/input.tpl");

    this.$el
      .find(".js-inputs-container")
        .append(tmpl({
          tickets: [{}]
        }));
  },
  removeUserInputs: function(e) {
    var $cur = $(e.currentTarget);

    $cur
      .parent(".js-user-item")
      .remove();
  },
  submitOrder: function() {
    this.mallCreateOrder();
  },
  mallCreateOrder: function() {
    var $inputs = this.$el.find("input[name]");

    for (var i = 0, len = $inputs.length; i < len; i += 1) {
      if ( $inputs[i].value.trim() === "" ) {
        toast("请输入完整的信息", 1500);
        return;
      }
    }

    hint.showLoading();

    var formValue = [];

    this.$el.find(".js-user-item").each(function(index, item) {
      var userInfo = {};
      $(item).find("input").each(function(i, elem) {
        userInfo[elem.name] = elem.value;
      });
      formValue.push(userInfo);
    });

    async.waterfall([
      function(next) {
        appInfo.getUserData(function(err, userData) {
          if (err) {
            toast(err.message, 1500);
            return;
          }

          next(null, userData);
        });
      },
      function(userData, next) {
        var params = _.extend({}, userData.userInfo, {
          p: userData.deviceInfo.p,
          productid: UrlUtil.parseUrlSearch().productid,
          input: formValue
        });

        sendPost("createOrder", params, function(err, data) {
          next(err, data);
        });
      }
    ], function(err, result) {
      if (err) {
        toast(err.message, 1500);
        return;
      }

      // hint.hideLoading();
      window.location.href = window.location.origin +
        "/fe/app/client/mall/html/detail-page/order-detail.html" +
        "?orderid=" + result.orderid;
    });
  }
});

new AppView();
